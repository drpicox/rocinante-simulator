/**
 * Rocket Equation Physics
 *
 * Implements the Tsiolkovsky rocket equation and related calculations
 * for fusion-powered spacecraft with constant acceleration
 */

import { C, G, TONS_TO_KG } from '../../constants/physics'

/**
 * Calculate exhaust velocity from fusion efficiency and propulsive efficiency
 *
 * Based on: v_e = c * sqrt(2 * η_fusion * η_propulsive)
 *
 * @param {number} fusionEfficiency - Mass-to-energy conversion efficiency (as percentage, e.g., 0.4 for 0.4%)
 * @param {number} propulsiveEfficiency - Energy-to-thrust efficiency (as percentage, e.g., 50 for 50%)
 * @returns {number} Exhaust velocity in m/s
 */
export function calculateExhaustVelocity(fusionEfficiency, propulsiveEfficiency) {
  const effFusion = fusionEfficiency / 100
  const effProp = propulsiveEfficiency / 100

  return C * Math.sqrt(2 * effFusion * effProp)
}

/**
 * Calculate total burn time for a given ship configuration
 *
 * Based on: t = (v_e / a) * ln(m_wet / m_dry)
 *
 * @param {number} dryMassTons - Dry mass (structure only) in tons
 * @param {number} wetMassTons - Wet mass (with full fuel) in tons
 * @param {number} accelerationG - Acceleration in g units
 * @param {number} exhaustVelocity - Exhaust velocity in m/s
 * @returns {number} Total burn time in seconds
 */
export function calculateBurnTime(dryMassTons, wetMassTons, accelerationG, exhaustVelocity) {
  const dryMassKg = dryMassTons * TONS_TO_KG
  const wetMassKg = wetMassTons * TONS_TO_KG
  const acceleration = accelerationG * G

  // Tsiolkovsky equation solved for time
  return (exhaustVelocity / acceleration) * Math.log(wetMassKg / dryMassKg)
}

/**
 * Calculate mass at a given time during burn
 *
 * m(t) = m_wet * exp(-a * t / v_e)
 *
 * @param {number} wetMassKg - Initial wet mass in kg
 * @param {number} time - Time since burn start in seconds
 * @param {number} accelerationG - Acceleration in g units
 * @param {number} exhaustVelocity - Exhaust velocity in m/s
 * @returns {number} Mass at time t in kg
 */
export function calculateMassAtTime(wetMassKg, time, accelerationG, exhaustVelocity) {
  const acceleration = accelerationG * G
  return wetMassKg * Math.exp(-acceleration * time / exhaustVelocity)
}

/**
 * Calculate initial mass flow rate
 *
 * dm/dt = (m * a) / v_e
 *
 * @param {number} wetMassKg - Initial wet mass in kg
 * @param {number} accelerationG - Acceleration in g units
 * @param {number} exhaustVelocity - Exhaust velocity in m/s
 * @returns {number} Initial mass flow rate in kg/s
 */
export function calculateInitialMassFlow(wetMassKg, accelerationG, exhaustVelocity) {
  const acceleration = accelerationG * G
  return (wetMassKg * acceleration) / exhaustVelocity
}

/**
 * Calculate fuel mass required for a journey
 *
 * For a symmetric acceleration/deceleration profile
 *
 * @param {number} dryMassTons - Dry mass in tons
 * @param {number} totalTime - Total burn time in seconds
 * @param {number} accelerationG - Acceleration in g units
 * @param {number} exhaustVelocity - Exhaust velocity in m/s
 * @returns {number} Fuel mass required in tons
 */
export function calculateFuelRequired(dryMassTons, totalTime, accelerationG, exhaustVelocity) {
  const acceleration = accelerationG * G
  const dryMassKg = dryMassTons * TONS_TO_KG

  // Solve: m_wet = m_dry * exp(a * t / v_e)
  const massRatio = Math.exp(acceleration * totalTime / exhaustVelocity)
  const wetMassKg = dryMassKg * massRatio

  return (wetMassKg - dryMassKg) / TONS_TO_KG
}
