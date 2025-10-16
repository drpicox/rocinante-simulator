/**
 * Trajectory Calculations
 *
 * Handles spaceflight trajectory calculations with constant acceleration,
 * including coast phases when destinations exceed ship's range
 */

import { G, AU, SECONDS_PER_DAY } from '../../constants/physics'
import {
  calculateLorentzFactor,
  calculateProperTime
} from './relativity'
import { calculateMassAtTime } from './rocket-equation'

/**
 * Calculate distance traveled during constant acceleration
 *
 * d = 0.5 * a * t²
 *
 * @param {number} accelerationG - Acceleration in g units
 * @param {number} time - Time in seconds
 * @returns {number} Distance in meters
 */
export function calculateAccelerationDistance(accelerationG, time) {
  const acceleration = accelerationG * G
  return 0.5 * acceleration * time * time
}

/**
 * Calculate velocity after constant acceleration
 *
 * v = a * t
 *
 * @param {number} accelerationG - Acceleration in g units
 * @param {number} time - Time in seconds
 * @returns {number} Velocity in m/s
 */
export function calculateVelocity(accelerationG, time) {
  const acceleration = accelerationG * G
  return acceleration * time
}

/**
 * Calculate journey details for a destination (with or without coast phase)
 *
 * @param {Object} params - Journey parameters
 * @param {number} params.distanceAU - Distance to destination in AU
 * @param {number} params.maxRangeMeters - Maximum range without coast in meters
 * @param {number} params.maxBurnTime - Maximum burn time (total for accel+decel) in seconds
 * @param {number} params.accelerationG - Ship acceleration in g
 * @param {number} params.wetMassKg - Initial wet mass in kg
 * @param {number} params.dryMassKg - Dry mass in kg
 * @param {number} params.exhaustVelocity - Exhaust velocity in m/s
 * @returns {Object} Journey details with times, velocities, fuel usage
 */
export function calculateJourney(params) {
  const {
    distanceAU,
    maxRangeMeters,
    maxBurnTime,
    accelerationG,
    wetMassKg,
    dryMassKg,
    exhaustVelocity
  } = params

  const distanceMeters = distanceAU * AU
  const acceleration = accelerationG * G

  // Check if destination is within range (no coast needed)
  if (distanceMeters <= maxRangeMeters) {
    return calculateDirectJourney({
      distanceMeters,
      acceleration,
      wetMassKg,
      dryMassKg,
      exhaustVelocity
    })
  } else {
    return calculateCoastJourney({
      distanceMeters,
      maxBurnTime,
      acceleration,
      wetMassKg,
      dryMassKg,
      exhaustVelocity
    })
  }
}

/**
 * Calculate direct journey (no coast phase)
 * Ship accelerates for half the distance, then decelerates for the other half
 *
 * @private
 */
function calculateDirectJourney(params) {
  const { distanceMeters, acceleration, wetMassKg, dryMassKg, exhaustVelocity } = params

  // Time to accelerate (and decelerate) - from d = 2 * (0.5 * a * t²)
  const accelTime = Math.sqrt(distanceMeters / (2 * acceleration))
  const totalTime = 2 * accelTime

  // Maximum velocity reached at midpoint
  const vMax = acceleration * accelTime

  // Fuel used
  const finalMass = calculateMassAtTime(wetMassKg, totalTime, acceleration / G, exhaustVelocity)
  const fuelUsedKg = wetMassKg - finalMass
  const fuelMassKg = wetMassKg - dryMassKg
  const fuelPercent = (fuelUsedKg / fuelMassKg) * 100

  // Relativistic effects
  const gamma = calculateLorentzFactor(vMax)
  const properTime = calculateProperTime(totalTime, vMax)

  return {
    totalTime,
    totalDays: totalTime / SECONDS_PER_DAY,
    properTime,
    properDays: properTime / SECONDS_PER_DAY,
    timeDiff: (totalTime - properTime) / SECONDS_PER_DAY,
    vMax: vMax / 1000, // Convert to km/s for display
    fuelUsedKg,
    fuelUsedTons: fuelUsedKg / 1000,
    fuelPercent,
    coastPhase: false,
    coastTime: 0,
    coastDays: 0,
    possible: true,
    gamma
  }
}

/**
 * Calculate journey with coast phase
 * Ship burns 50% fuel to accelerate, coasts at max velocity, then burns 50% fuel to decelerate
 *
 * @private
 */
function calculateCoastJourney(params) {
  const { distanceMeters, maxBurnTime, acceleration, wetMassKg, dryMassKg, exhaustVelocity } = params

  // Use half of max burn time for acceleration, half for deceleration
  const halfBurnTime = maxBurnTime / 2

  // Distance covered during acceleration and deceleration
  const accelDist = calculateAccelerationDistance(acceleration / G, halfBurnTime)
  const decelDist = accelDist // Symmetric

  // Maximum velocity reached
  const vMax = acceleration * halfBurnTime

  // Distance and time for coast phase
  const coastDist = distanceMeters - accelDist - decelDist
  const coastTime = coastDist / vMax

  // Total journey time
  const totalTime = 2 * halfBurnTime + coastTime

  // Fuel used (all of it)
  const fuelMassKg = wetMassKg - dryMassKg

  // Relativistic effects
  // During acceleration and deceleration, time dilates
  // During coast, time also dilates (constant velocity)
  const gamma = calculateLorentzFactor(vMax)
  const properAccelTime = calculateProperTime(halfBurnTime, vMax)
  const properDecelTime = properAccelTime // Symmetric
  const properCoastTime = coastTime / gamma // Constant velocity dilation
  const properTime = properAccelTime + properCoastTime + properDecelTime

  return {
    totalTime,
    totalDays: totalTime / SECONDS_PER_DAY,
    properTime,
    properDays: properTime / SECONDS_PER_DAY,
    timeDiff: (totalTime - properTime) / SECONDS_PER_DAY,
    vMax: vMax / 1000, // Convert to km/s for display
    fuelUsedKg: fuelMassKg,
    fuelUsedTons: fuelMassKg / 1000,
    fuelPercent: 100,
    coastPhase: true,
    coastTime,
    coastDays: coastTime / SECONDS_PER_DAY,
    possible: true,
    gamma
  }
}

/**
 * Generate trajectory data points for charting
 * Returns arrays of time, velocity, mass, and distance
 *
 * @param {Object} params - Trajectory parameters
 * @param {number} params.accelTime - Acceleration phase time in seconds
 * @param {number} params.wetMassKg - Initial wet mass in kg
 * @param {number} params.accelerationG - Acceleration in g
 * @param {number} params.exhaustVelocity - Exhaust velocity in m/s
 * @param {number} params.points - Number of data points to generate
 * @returns {Array} Array of data points {time, velocity, mass, distance}
 */
export function generateTrajectoryData(params) {
  const {
    accelTime,
    wetMassKg,
    accelerationG,
    exhaustVelocity,
    points = 100
  } = params

  const acceleration = accelerationG * G
  const dt = accelTime / points
  const data = []

  // Acceleration phase
  for (let i = 0; i <= points; i++) {
    const t = i * dt
    const tDays = t / SECONDS_PER_DAY

    const mass = calculateMassAtTime(wetMassKg, t, accelerationG, exhaustVelocity)
    const velocity = acceleration * t / 1000 // km/s
    const distance = 0.5 * acceleration * t * t / AU // AU

    data.push({
      time: tDays,
      velocity,
      mass: mass / 1000, // tons
      distance
    })
  }

  // Deceleration phase
  const vMax = acceleration * accelTime
  for (let i = 1; i <= points; i++) {
    const t = i * dt
    const tTotal = accelTime + t
    const tDays = tTotal / SECONDS_PER_DAY

    const velocity = Math.max(0, (vMax - acceleration * t) / 1000) // km/s
    const distAccel = 0.5 * acceleration * accelTime * accelTime
    const distDecel = vMax * t - 0.5 * acceleration * t * t
    const distance = (distAccel + distDecel) / AU // AU

    const mass = calculateMassAtTime(wetMassKg, tTotal, accelerationG, exhaustVelocity)

    data.push({
      time: tDays,
      velocity,
      mass: mass / 1000, // tons
      distance
    })
  }

  return data
}
