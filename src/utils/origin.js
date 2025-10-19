// filepath: /Volumes/Projects/claude/rocinante-simulator/src/utils/origin.js
import { useSelector, useDispatch } from 'react-redux'
import { selectOrigin, setOrigin } from '../features/origin/originSlice'
import { planets } from '../data/spaceData'

// Build a set of all solar-system names: Sun, planets, and moons
const solarSystemSet = new Set(['Sun', 'Sol (Our Sun)'])
for (const p of planets) {
  solarSystemSet.add(p.name)
  if (Array.isArray(p.moons)) for (const m of p.moons) solarSystemSet.add(m.name)
}
export const SOLAR_SYSTEM_NAMES = solarSystemSet

// Determine if a given render-name should be treated as origin, with optional Sol proxy behavior
export function isOriginForName(origin, name, { solProxy = false } = {}) {
  if (!origin?.name) return false
  if (solProxy && name === 'Sol (Our Sun)') {
    // When showing the star proxy for the solar system, any solar-system origin should count
    return SOLAR_SYSTEM_NAMES.has(origin.name)
  }
  return origin.name === name
}

// React hook to get origin and compute isOrigin for a name
export function useIsOrigin(name, options) {
  const origin = useSelector(selectOrigin)
  return isOriginForName(origin, name, options)
}

// React hook returning a click handler that sets origin on Shift+Click and otherwise delegates
export function useOriginClick(name, kind, onClick) {
  const dispatch = useDispatch()
  return (e) => {
    e.stopPropagation()
    if (e.shiftKey) {
      // Normalize Sol proxy to Sun when used as origin
      const canonicalName = name === 'Sol (Our Sun)' ? 'Sun' : name
      dispatch(setOrigin({ name: canonicalName, kind }))
      return
    }
    onClick && onClick()
  }
}

