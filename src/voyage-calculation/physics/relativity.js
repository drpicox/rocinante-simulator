/**
 * Relativistic Physics Calculations
 *
 * Handles special relativity effects for high-velocity spacecraft:
 * - Lorentz factor (gamma)
 * - Time dilation
 * - Length contraction
 */

import { C } from '../../constants/physics'

/**
 * Calculate the Lorentz factor (γ) for a given velocity
 *
 * γ = 1 / sqrt(1 - v²/c²)
 *
 * @param {number} velocity - Velocity in m/s
 * @returns {number} Lorentz factor (dimensionless, ≥ 1)
 */
export function calculateLorentzFactor(velocity) {
  const beta = velocity / C  // v/c ratio

  // Prevent division by zero or imaginary numbers
  if (beta >= 1) return Infinity
  if (beta <= 0) return 1

  return 1 / Math.sqrt(1 - beta * beta)
}

/**
 * Calculate time dilation factor
 *
 * The ratio of proper time (experienced by crew) to coordinate time (Earth time)
 *
 * @param {number} velocity - Velocity in m/s
 * @returns {number} Time dilation factor (crew time / Earth time, ≤ 1)
 */
export function calculateTimeDilation(velocity) {
  const gamma = calculateLorentzFactor(velocity)
  return 1 / gamma
}

/**
 * Calculate length contraction factor
 *
 * The ratio of contracted length (from crew's perspective) to proper length
 *
 * @param {number} velocity - Velocity in m/s
 * @returns {number} Length contraction factor (≤ 1)
 */
export function calculateLengthContraction(velocity) {
  const gamma = calculateLorentzFactor(velocity)
  return 1 / gamma
}

/**
 * Calculate proper time (experienced by crew) for a journey with varying velocity
 *
 * For constant acceleration, we approximate by using the average gamma factor
 *
 * @param {number} coordinateTime - Time as measured from Earth (seconds)
 * @param {number} maxVelocity - Maximum velocity reached (m/s)
 * @returns {number} Proper time in seconds
 */
export function calculateProperTime(coordinateTime, maxVelocity) {
  const gammaMax = calculateLorentzFactor(maxVelocity)

  // Average gamma during acceleration from 0 to v_max
  // This is an approximation; exact calculation requires integration
  const gammaAverage = (1 + gammaMax) / 2

  return coordinateTime / gammaAverage
}

/**
 * Calculate velocity as a fraction of speed of light
 *
 * @param {number} velocity - Velocity in m/s
 * @returns {number} Velocity as fraction of c (0 to 1)
 */
export function velocityFractionOfC(velocity) {
  return velocity / C
}
