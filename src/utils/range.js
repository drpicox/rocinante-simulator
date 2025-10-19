// Calculate maximum range based on relativistic rocket equation
export function calculateMaxRange(m_dry, m_fuel, efficiency, acceleration_g) {
  const c = 299792458 // speed of light in m/s
  const g = 9.81 // acceleration due to gravity in m/s²

  // Convert efficiency from percentage to decimal
  const eta = efficiency / 100

  // Convert acceleration from g's to m/s²
  const a = acceleration_g * g

  // Total mass at start
  const m0 = m_dry + m_fuel

  // Total proper time burning all fuel (split 50/50 for acceleration/deceleration)
  const tau_total_burn = (eta * c / a) * Math.log(m0 / m_dry)
  const tau_half = tau_total_burn / 2

  // Distance covered in each phase (acceleration and deceleration)
  const x_half = (c * c / a) * (Math.cosh(a * tau_half / c) - 1)

  // Total range (acceleration + deceleration)
  return 2 * x_half // in meters
}

// Format range for display
export function formatRange(rangeMeters) {
  const AU = 149597870700 // 1 AU in meters
  const ly = 9.461e15 // 1 light-year in meters

  if (rangeMeters < AU) {
    // Show in million km
    const millionKm = rangeMeters / 1e9
    return `${millionKm.toFixed(2)} M km`
  } else if (rangeMeters < ly) {
    // Show in AU
    const au = rangeMeters / AU
    return `${au.toFixed(2)} AU`
  } else {
    // Show in light-years
    const lightYears = rangeMeters / ly
    return `${lightYears.toFixed(2)} ly`
  }
}
