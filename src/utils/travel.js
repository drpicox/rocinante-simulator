// Relativistic travel calculations based on constant acceleration
// Using the relativistic rocket equation

const c = 299792458 // speed of light in m/s
const g = 9.81 // acceleration due to gravity in m/s²

/**
 * Calculate travel parameters for a journey
 * @param {number} distance_m - Distance in meters
 * @param {number} m_dry - Dry ship mass in tons
 * @param {number} m_fuel - Fuel mass in tons
 * @param {number} efficiency - Efficiency as percentage (0-100)
 * @param {number} acceleration_g - Acceleration in g's
 * @returns {object} Travel information including times and fuel consumption
 */
export function calculateTravel(distance_m, m_dry, m_fuel, efficiency, acceleration_g) {
  // Convert parameters
  const eta = efficiency / 100 // efficiency as decimal
  const a = acceleration_g * g // acceleration in m/s²
  const m0 = m_dry + m_fuel // total initial mass
  const D = distance_m // distance to travel

  // Step 1: Calculate ideal case (enough fuel?)
  const tau_ideal = calculateIdealBurnTime(D, a)
  const fuel_required = m0 * (1 - Math.exp(-2 * a * tau_ideal / (eta * c)))

  if (fuel_required <= m_fuel) {
    // Case 1: Constant acceleration (enough fuel)
    return constantAccelerationCase(D, a, m0, eta)
  } else {
    // Case 2: Coast required (not enough fuel)
    return coastCase(D, a, m0, m_fuel, eta)
  }
}

/**
 * Calculate ideal burn time for constant acceleration to distance D
 * Solve: D/2 = (c²/a)[cosh(aτ/c) - 1]
 */
function calculateIdealBurnTime(D, a) {
  // τ_half = (c/a) · acosh(1 + aD/(2c²))
  return (c / a) * Math.acosh(1 + (a * D) / (2 * c * c))
}

/**
 * Case 1: Constant Acceleration (Enough Fuel)
 */
function constantAccelerationCase(D, a, m0, eta) {
  // Find proper time to reach D/2
  const tau_half = (c / a) * Math.acosh(1 + (a * D) / (2 * c * c))

  // Acceleration phase (0 → D/2)
  const v_max = c * Math.tanh((a * tau_half) / c)
  const t_accel = (c / a) * Math.sinh((a * tau_half) / c)
  const m_after_accel = m0 * Math.exp((-a * tau_half) / (eta * c))

  // Deceleration phase (D/2 → D) - symmetric
  const m_final = m_after_accel * Math.exp((-a * tau_half) / (eta * c))

  // Results
  return {
    fuelConsumed: m0 - m_final, // tons
    shipTime: 2 * tau_half, // proper time (seconds)
    observerTime: 2 * t_accel, // coordinate time (seconds)
    coastTime: 0, // no coast phase
    maxVelocity: v_max, // m/s
    hasEnoughFuel: true
  }
}

/**
 * Case 2: Coast Required (Not Enough Fuel)
 */
function coastCase(D, a, m0, m_fuel, eta) {
  // Burn half the available fuel during acceleration
  // Solve: m₀ · exp(-aτ_burn/(ηc)) = m₀ - m_fuel/2
  const tau_burn = (eta * c / a) * Math.log(m0 / (m0 - m_fuel / 2))

  // Acceleration phase
  const x_accel = (c * c / a) * (Math.cosh((a * tau_burn) / c) - 1)
  const v_cruise = c * Math.tanh((a * tau_burn) / c)
  const t_accel = (c / a) * Math.sinh((a * tau_burn) / c)

  // Coast phase
  const x_coast = D - 2 * x_accel
  const gamma = 1 / Math.sqrt(1 - (v_cruise * v_cruise) / (c * c)) // Lorentz factor
  const tau_coast = (x_coast / v_cruise) / gamma // proper time
  const t_coast = x_coast / v_cruise // coordinate time

  // Deceleration phase (symmetric to acceleration)
  // Results
  return {
    fuelConsumed: m_fuel, // all fuel consumed
    shipTime: 2 * tau_burn + tau_coast, // proper time (seconds)
    observerTime: 2 * t_accel + t_coast, // coordinate time (seconds)
    coastTime: tau_coast, // coast time in ship time (seconds)
    maxVelocity: v_cruise, // m/s
    hasEnoughFuel: false
  }
}

/**
 * Format time for display (convert seconds to appropriate units)
 */
export function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '—'

  const minute = 60
  const hour = 3600
  const day = 86400
  const year = 365.25 * day

  if (seconds < minute) {
    return `${seconds.toFixed(2)} s`
  } else if (seconds < hour) {
    return `${(seconds / minute).toFixed(2)} min`
  } else if (seconds < day) {
    return `${(seconds / hour).toFixed(2)} h`
  } else if (seconds < year) {
    return `${(seconds / day).toFixed(2)} days`
  } else {
    return `${(seconds / year).toFixed(2)} years`
  }
}

/**
 * Format mass for display
 */
export function formatMass(tons) {
  if (!isFinite(tons) || tons < 0) return '—'

  if (tons < 1) {
    return `${(tons * 1000).toFixed(2)} kg`
  } else if (tons < 1000) {
    return `${tons.toFixed(2)} tons`
  } else {
    return `${(tons / 1000).toFixed(2)} kt`
  }
}
