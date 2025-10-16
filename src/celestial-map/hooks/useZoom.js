/**
 * useZoom Hook
 *
 * Manages progressive zoom with logarithmic scaling
 * Provides smooth transitions between different scale levels
 */

import { useState, useCallback, useMemo } from 'react'

/**
 * Zoom levels with their characteristics
 * Each level defines the scale (AU per unit) and the max distance shown
 */
export const ZOOM_LEVELS = [
  {
    id: 'iss',
    name: 'ISS Orbit',
    scale: 0.000001,      // Very zoomed in
    maxDistance: 0.001,    // Show up to 0.001 AU (~150,000 km)
    minObjectSize: 4
  },
  {
    id: 'earth-moon',
    name: 'Earth-Moon',
    scale: 0.00001,
    maxDistance: 0.003,
    minObjectSize: 4
  },
  {
    id: 'inner-earth',
    name: 'Near Earth',
    scale: 0.0001,
    maxDistance: 0.02,     // Lagrange points
    minObjectSize: 4
  },
  {
    id: 'inner-solar',
    name: 'Inner Solar System',
    scale: 0.012,          // Earth to Mars range
    maxDistance: 2.0,
    minObjectSize: 3
  },
  {
    id: 'mid-solar',
    name: 'Mid Solar System',
    scale: 0.08,           // Out to Jupiter
    maxDistance: 8.0,
    minObjectSize: 3
  },
  {
    id: 'outer-solar',
    name: 'Outer Solar System',
    scale: 0.25,           // Out to Neptune/Pluto
    maxDistance: 50,
    minObjectSize: 2
  },
  {
    id: 'kuiper',
    name: 'Kuiper Belt',
    scale: 1.5,
    maxDistance: 100,
    minObjectSize: 2
  },
  {
    id: 'oort-inner',
    name: 'Inner Oort Cloud',
    scale: 20,
    maxDistance: 5000,
    minObjectSize: 2
  },
  {
    id: 'oort-outer',
    name: 'Outer Oort Cloud',
    scale: 600,
    maxDistance: 150000,
    minObjectSize: 2
  },
  {
    id: 'stellar-near',
    name: 'Nearby Stars',
    scale: 3000,           // Few light years
    maxDistance: 500000,   // ~8 LY
    minObjectSize: 3
  },
  {
    id: 'stellar-far',
    name: 'Local Neighborhood',
    scale: 10000,
    maxDistance: 1000000,  // ~15 LY
    minObjectSize: 4
  }
]

/**
 * Hook for managing zoom state and transitions
 *
 * @param {number} initialLevel - Initial zoom level index (default: 5 = outer-solar)
 * @returns {Object} Zoom controls and current state
 */
export function useZoom(initialLevel = 5) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(initialLevel)

  const currentLevel = ZOOM_LEVELS[currentLevelIndex]

  const zoomIn = useCallback(() => {
    setCurrentLevelIndex(prev => Math.max(0, prev - 1))
  }, [])

  const zoomOut = useCallback(() => {
    setCurrentLevelIndex(prev => Math.min(ZOOM_LEVELS.length - 1, prev + 1))
  }, [])

  const setZoomLevel = useCallback((levelId) => {
    const index = ZOOM_LEVELS.findIndex(level => level.id === levelId)
    if (index !== -1) {
      setCurrentLevelIndex(index)
    }
  }, [])

  const canZoomIn = currentLevelIndex > 0
  const canZoomOut = currentLevelIndex < ZOOM_LEVELS.length - 1

  return {
    currentLevel,
    currentLevelIndex,
    zoomIn,
    zoomOut,
    setZoomLevel,
    canZoomIn,
    canZoomOut,
    totalLevels: ZOOM_LEVELS.length
  }
}

/**
 * Convert AU distance to pixels based on zoom level
 *
 * @param {number} distanceAU - Distance in AU
 * @param {Object} zoomLevel - Current zoom level
 * @param {number} viewportSize - Size of the viewport in pixels (default: 1000)
 * @returns {number} Distance in pixels
 */
export function auToPixels(distanceAU, zoomLevel, viewportSize = 1000) {
  // Map the max distance of the zoom level to half the viewport
  const pixelsPerAU = (viewportSize / 2) / zoomLevel.maxDistance
  return distanceAU * pixelsPerAU
}

/**
 * Convert pixels to AU based on zoom level
 *
 * @param {number} pixels - Distance in pixels
 * @param {Object} zoomLevel - Current zoom level
 * @param {number} viewportSize - Size of the viewport in pixels (default: 1000)
 * @returns {number} Distance in AU
 */
export function pixelsToAU(pixels, zoomLevel, viewportSize = 1000) {
  const pixelsPerAU = (viewportSize / 2) / zoomLevel.maxDistance
  return pixels / pixelsPerAU
}
