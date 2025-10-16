/**
 * useVisibility Hook
 *
 * Level-of-Detail (LOD) system for rendering objects based on zoom level
 * Determines which objects should be visible at the current scale
 */

import { useMemo } from 'react'
import { PLANETS, DWARF_PLANETS, DESTINATIONS, OUTER_OBJECTS } from '../data/solar-system'
import { NEARBY_STARS } from '../data/stars'

/**
 * Determine which objects should be visible at a given zoom level
 *
 * @param {Object} zoomLevel - Current zoom level from useZoom
 * @param {Array} planetPositions - Calculated planet positions
 * @returns {Object} Filtered lists of visible objects
 */
export function useVisibility(zoomLevel, planetPositions) {
  return useMemo(() => {
    const maxDist = zoomLevel.maxDistance

    // Determine which categories to show
    const showPlanets = maxDist >= 0.3 && maxDist < 100000  // Hide planets in very close zoom and at interstellar distances
    const showMoons = maxDist <= 2.0    // Only show moons when zoomed in
    const showDwarfPlanets = maxDist >= 5.0 && maxDist < 100000
    const showStars = maxDist >= 200000  // About 3 light years
    const showOuterObjects = maxDist >= 1000 && maxDist < 100000

    // Filter planets by visibility
    let visiblePlanets = []
    if (showPlanets && planetPositions) {
      visiblePlanets = planetPositions.filter(planet => {
        // Always show Earth (origin)
        if (planet.name === 'Earth') return true

        // Filter by distance
        return planet.distanceAU <= maxDist
      })
    }

    // Filter destinations
    const visibleDestinations = DESTINATIONS.filter(dest => {
      return dest.distanceAU <= maxDist
    })

    // Filter dwarf planets
    let visibleDwarfPlanets = []
    if (showDwarfPlanets) {
      // For dwarf planets, we'd need positions, but for now show based on distance
      visibleDwarfPlanets = DWARF_PLANETS.filter(dwarf => {
        return dwarf.orbitalElements.a <= maxDist
      })
    }

    // Filter stars
    let visibleStars = []
    if (showStars) {
      visibleStars = NEARBY_STARS.filter(star => {
        return star.distanceAU <= maxDist
      })

      // Limit number of stars based on zoom level
      const maxStars = maxDist > 800000 ? 30 : 15
      if (visibleStars.length > maxStars) {
        // Show brightest stars
        visibleStars = [...visibleStars]
          .sort((a, b) => a.apparentMagnitude - b.apparentMagnitude)
          .slice(0, maxStars)
      }
    }

    // Filter outer objects
    let visibleOuterObjects = []
    if (showOuterObjects) {
      visibleOuterObjects = OUTER_OBJECTS.filter(obj => {
        return obj.distanceAU <= maxDist
      })
    }

    // Determine label visibility
    const showLabels = {
      planets: true,
      moons: showMoons,
      stars: visibleStars.length <= 20,
      destinations: maxDist <= 5.0
    }

    return {
      visiblePlanets,
      visibleDestinations,
      visibleDwarfPlanets,
      visibleStars,
      visibleOuterObjects,
      showMoons,
      showLabels,
      viewType: getViewType(maxDist)
    }
  }, [zoomLevel, planetPositions])
}

/**
 * Determine the view type based on max distance
 */
function getViewType(maxDistance) {
  if (maxDistance < 0.01) return 'near-earth'
  if (maxDistance < 2.0) return 'inner-solar'
  if (maxDistance < 10.0) return 'mid-solar'
  if (maxDistance < 100) return 'outer-solar'
  if (maxDistance < 5000) return 'kuiper-oort'
  return 'stellar'
}
