/**
 * Formatting utilities for time and distance display
 */

/**
 * Format time in days to appropriate units
 * @param {number} days - Time in days
 * @returns {string} Formatted time string
 */
export function formatTime(days) {
  if (days >= 365.25) {
    const years = days / 365.25
    return `${years.toFixed(1)} years`
  }
  if (days >= 30) {
    const months = days / 30
    return `${days.toFixed(0)} days (${months.toFixed(1)} months)`
  }
  return `${days.toFixed(1)} days`
}

/**
 * Format distance in AU to appropriate units
 * @param {number} distanceAU - Distance in astronomical units
 * @param {boolean} isInterstellar - Whether this is an interstellar distance
 * @returns {string} Formatted distance string
 */
export function formatDistance(distanceAU, isInterstellar = false) {
  // Convert to light years for very large distances
  if (isInterstellar && distanceAU > 10000) {
    const ly = distanceAU / 63241.077 // AU per light year
    return `${ly.toFixed(2)} ly`
  }

  if (distanceAU >= 1000) {
    return `${distanceAU.toFixed(0)} AU`
  }

  return `${distanceAU.toFixed(2)} AU`
}

/**
 * Format speed in km/s
 * @param {number} speedKms - Speed in km/s
 * @returns {string} Formatted speed string
 */
export function formatSpeed(speedKms) {
  if (speedKms >= 1000) {
    return `${speedKms.toFixed(0)} km/s`
  }
  return `${speedKms.toFixed(1)} km/s`
}

/**
 * Format percentage
 * @param {number} percent - Percentage value
 * @returns {string} Formatted percentage string
 */
export function formatPercent(percent) {
  if (percent >= 10) {
    return `${percent.toFixed(0)}%`
  }
  return `${percent.toFixed(1)}%`
}
