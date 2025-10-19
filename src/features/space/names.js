// filepath: /Volumes/Projects/claude/rocinante-simulator/src/features/space/names.js
import { planets } from '../../data/spaceData'

// Build a set of all solar-system names: Sun, planets, and moons
const solarSystemSet = new Set(['Sun', 'Sol (Our Sun)'])
for (const p of planets) {
  solarSystemSet.add(p.name)
  if (Array.isArray(p.moons)) for (const m of p.moons) solarSystemSet.add(m.name)
}

export const SOLAR_SYSTEM_NAMES = solarSystemSet

export function isNameInName(name, targetName) {
  if (!name || !targetName) return false
  if (targetName === 'Sol (Our Sun)') {
    // When showing the star proxy for the solar system, any solar-system origin should count
    return SOLAR_SYSTEM_NAMES.has(name)
  }
  return name === targetName
}

