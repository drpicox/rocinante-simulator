/**
 * usePlanetPositions Hook
 *
 * Calculates real-time planet positions using Keplerian orbital elements
 * Implements simplified orbital mechanics for accurate position calculation
 * OPTIMIZED: Memoized and only recalculates when date changes
 */

import { useMemo } from 'react'
import { PLANETS, DWARF_PLANETS } from '../data/solar-system'
import { J2000 } from '../../constants/physics'

/**
 * Calculate Julian Date from JavaScript Date
 * @param {Date} date - JavaScript Date object
 * @returns {number} Julian Date
 */
function dateToJulianDate(date) {
  const millisPerDay = 86400000
  const unixEpoch = 2440587.5 // JD for Jan 1, 1970
  return unixEpoch + (date.getTime() / millisPerDay)
}

/**
 * Calculate orbital elements at a given Julian Date
 * @param {Object} elements - Orbital elements at J2000
 * @param {number} jd - Julian Date
 * @returns {Object} Updated orbital elements
 */
function calculateElements(elements, jd) {
  // Centuries from J2000.0
  const T = (jd - J2000) / 36525

  return {
    a: elements.a + elements.aCy * T,
    e: elements.e + elements.eCy * T,
    i: elements.i + elements.iCy * T,
    L: elements.L + elements.LCy * T,
    longPeri: elements.longPeri + elements.longPeriCy * T,
    longNode: elements.longNode + elements.longNodeCy * T
  }
}

/**
 * Normalize angle to 0-360 degrees
 */
function normalizeAngle(angle) {
  angle = angle % 360
  return angle < 0 ? angle + 360 : angle
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
  return degrees * Math.PI / 180
}

/**
 * Solve Kepler's equation for eccentric anomaly
 * Uses Newton-Raphson iteration
 *
 * @param {number} M - Mean anomaly (radians)
 * @param {number} e - Eccentricity
 * @returns {number} Eccentric anomaly (radians)
 */
function solveKeplersEquation(M, e) {
  let E = M // Initial guess
  const tolerance = 1e-6 // Reduced precision for performance
  const maxIterations = 10 // Reduced iterations for performance

  for (let i = 0; i < maxIterations; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    E -= dE

    if (Math.abs(dE) < tolerance) break
  }

  return E
}

/**
 * Calculate heliocentric position of a planet
 *
 * @param {Object} elements - Orbital elements
 * @returns {Object} Position {x, y, z} in AU
 */
function calculateHeliocentricPosition(elements) {
  // Compute argument of perihelion and mean anomaly
  const omega = toRadians(elements.longPeri - elements.longNode) // argument of perihelion
  const M = toRadians(normalizeAngle(elements.L - elements.longPeri)) // mean anomaly

  // Solve Kepler's equation for eccentric anomaly
  const E = solveKeplersEquation(M, elements.e)

  // Calculate true anomaly
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + elements.e) * Math.sin(E / 2),
    Math.sqrt(1 - elements.e) * Math.cos(E / 2)
  )

  // Calculate distance to Sun
  const r = elements.a * (1 - elements.e * Math.cos(E))

  // Calculate position in orbital plane
  const xOrbital = r * Math.cos(nu)
  const yOrbital = r * Math.sin(nu)

  // Simplified 2D projection for performance (good enough for visualization)
  const Omega = toRadians(elements.longNode)
  const i = toRadians(elements.i)
  const cosOmega = Math.cos(omega)
  const sinOmega = Math.sin(omega)
  const cosOmegaCap = Math.cos(Omega)
  const sinOmegaCap = Math.sin(Omega)
  const cosI = Math.cos(i)

  const x = xOrbital * (cosOmega * cosOmegaCap - sinOmega * sinOmegaCap * cosI) -
            yOrbital * (sinOmega * cosOmegaCap + cosOmega * sinOmegaCap * cosI)

  const y = xOrbital * (cosOmega * sinOmegaCap + sinOmega * cosOmegaCap * cosI) -
            yOrbital * (sinOmega * sinOmegaCap - cosOmega * cosOmegaCap * cosI)

  const z = xOrbital * (sinOmega * Math.sin(i)) +
            yOrbital * (cosOmega * Math.sin(i))

  return { x, y, z }
}

/**
 * Hook to calculate planet positions for a given date
 * OPTIMIZED: Only recalculates when date changes significantly
 *
 * @param {Date} date - Date for which to calculate positions (default: now)
 * @param {boolean} includeDwarfPlanets - Whether to include dwarf planets
 * @returns {Array} Array of planets with positions {name, x, y, z, distance, angle}
 */
export function usePlanetPositions(date = new Date(), includeDwarfPlanets = false) {
  // Round date to nearest day to prevent constant recalculation
  const dateKey = useMemo(() => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }, [date])

  return useMemo(() => {
    const jd = dateToJulianDate(new Date(dateKey))

    const allPlanets = includeDwarfPlanets
      ? [...PLANETS, ...DWARF_PLANETS]
      : PLANETS

    return allPlanets.map(planet => {
      const elements = calculateElements(planet.orbitalElements, jd)
      const position = calculateHeliocentricPosition(elements)

      // Calculate distance from Sun and angle for 2D display
      const distance = Math.sqrt(position.x * position.x + position.y * position.y)
      const angle = Math.atan2(position.y, position.x) * 180 / Math.PI

      return {
        name: planet.name,
        color: planet.color,
        radius: planet.radius,
        x: position.x,
        y: position.y,
        z: position.z,
        distanceAU: distance, // Distance from Sun in AU
        angle: normalizeAngle(angle), // Angle in degrees
        moons: planet.moons
      }
    })
  }, [dateKey, includeDwarfPlanets])
}

/**
 * Hook to get Earth's position for a given date
 * Useful for setting the origin when viewing from Earth
 *
 * @param {Date} date - Date for which to calculate Earth's position
 * @returns {Object} Earth's position {x, y, z, distance, angle}
 */
export function useEarthPosition(date = new Date()) {
  const planets = usePlanetPositions(date, false)
  return planets.find(p => p.name === 'Earth')
}
