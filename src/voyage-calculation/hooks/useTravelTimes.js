/**
 * useTravelTimes Hook
 *
 * Calculate journey times for all destinations based on ship configuration
 */

import { useMemo } from 'react'
import { calculateJourney } from '../physics/trajectory'
import { TONS_TO_KG } from '../../constants/physics'

/**
 * Calculate travel times for a list of destinations
 *
 * @param {Array} destinations - List of destinations with {name, distanceAU}
 * @param {Object} shipConfig - Ship configuration
 * @param {number} shipConfig.dryMass - Dry mass in tons
 * @param {number} shipConfig.wetMass - Wet mass in tons
 * @param {number} shipConfig.acceleration - Acceleration in g
 * @param {number} shipConfig.vExhaust - Exhaust velocity in m/s
 * @param {number} shipConfig.maxRangeMeters - Max range without coast in meters
 * @param {number} shipConfig.maxBurnTime - Max burn time in seconds
 * @returns {Array} Array of journey details for each destination
 */
export function useTravelTimes(destinations, shipConfig) {
  return useMemo(() => {
    if (!destinations || destinations.length === 0) return []

    const {
      dryMass,
      wetMass,
      acceleration,
      vExhaust,
      maxRangeMeters,
      maxBurnTime
    } = shipConfig

    const dryMassKg = dryMass * TONS_TO_KG
    const wetMassKg = wetMass * TONS_TO_KG

    return destinations.map(destination => {
      const journey = calculateJourney({
        distanceAU: destination.distanceAU,
        maxRangeMeters,
        maxBurnTime,
        accelerationG: acceleration,
        wetMassKg,
        dryMassKg,
        exhaustVelocity: vExhaust
      })

      return {
        ...destination,
        ...journey
      }
    })
  }, [destinations, shipConfig])
}
