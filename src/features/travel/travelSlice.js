import { createSlice } from '@reduxjs/toolkit'
import { planets, stars } from '../../data/spaceData'
import { SOLAR_SYSTEM_NAMES } from '../space/names'

// Helper functions for distance computation
const canonicalName = (name) => (name === 'Sol (Our Sun)' ? 'Sun' : name)
const findPlanet = (name) => planets.find((p) => p.name === name)
const findMoon = (name) => {
  for (const p of planets) {
    const m = p.moons?.find((mo) => mo.name === name)
    if (m) return { planet: p, moon: m }
  }
  return null
}
const findStar = (name) => stars.find((s) => s.name === name)
const isSolar = (name) => SOLAR_SYSTEM_NAMES.has(canonicalName(name))

const AU_PER_LY = 63241.077

// Core distance computation: origin -> destination
function computeTripDistance(originName, destName) {
  if (!originName || !destName) return null

  const A = canonicalName(originName)
  const B = canonicalName(destName)

  if (A === B) return { au: 0, ly: 0 }

  const starA = findStar(A)
  const starB = findStar(B)

  // Both stars: use 3D vector difference in ly coordinates
  if (starA && starB) {
    const dx = starA.x - starB.x
    const dy = starA.y - starB.y
    const dz = starA.z - starB.z
    const ly = Math.sqrt(dx * dx + dy * dy + dz * dz)
    return { ly, au: ly * AU_PER_LY }
  }

  // One star, one solar-system body: use star.distance from Sun (approx)
  if (starA && isSolar(B)) {
    const ly = starA.distance
    return { ly, au: ly * AU_PER_LY }
  }
  if (starB && isSolar(A)) {
    const ly = starB.distance
    return { ly, au: ly * AU_PER_LY }
  }

  // Solar-system only: compute AU using simple radial model
  const radAU = (name) => {
    if (name === 'Sun') return 0
    const p = findPlanet(name)
    if (p) return p.distance
    const mm = findMoon(name)
    if (mm) return mm.planet.distance // radial position ~ planet distance
    return null
  }

  const samePlanetMoonDistance = (name1, name2) => {
    const m1 = findMoon(name1)
    const m2 = findMoon(name2)
    if (m1 && m2 && m1.planet.name === m2.planet.name) {
      return Math.abs((m1.moon.distance ?? 0) - (m2.moon.distance ?? 0))
    }
    return null
  }

  // Specific cases with better approximations
  // Sun <-> Planet
  if (A === 'Sun' && findPlanet(B)) {
    const au = findPlanet(B).distance
    return { au, ly: au / AU_PER_LY }
  }
  if (B === 'Sun' && findPlanet(A)) {
    const au = findPlanet(A).distance
    return { au, ly: au / AU_PER_LY }
  }

  // Sun <-> Moon
  if (A === 'Sun' && findMoon(B)) {
    const { planet, moon } = findMoon(B)
    const au = planet.distance + (moon.distance || 0)
    return { au, ly: au / AU_PER_LY }
  }
  if (B === 'Sun' && findMoon(A)) {
    const { planet, moon } = findMoon(A)
    const au = planet.distance + (moon.distance || 0)
    return { au, ly: au / AU_PER_LY }
  }

  // Planet <-> Planet
  if (findPlanet(A) && findPlanet(B)) {
    const au = Math.abs(findPlanet(A).distance - findPlanet(B).distance)
    return { au, ly: au / AU_PER_LY }
  }

  // Planet <-> Moon
  if (findPlanet(A) && findMoon(B)) {
    const { planet, moon } = findMoon(B)
    const au = planet.name === A
      ? (moon.distance || 0)
      : Math.abs(findPlanet(A).distance - planet.distance)
    return { au, ly: au / AU_PER_LY }
  }
  if (findMoon(A) && findPlanet(B)) {
    const { planet, moon } = findMoon(A)
    const au = planet.name === B
      ? (moon.distance || 0)
      : Math.abs(findPlanet(B).distance - planet.distance)
    return { au, ly: au / AU_PER_LY }
  }

  // Moon <-> Moon (same planet)
  const mmSame = samePlanetMoonDistance(A, B)
  if (mmSame != null) return { au: mmSame, ly: mmSame / AU_PER_LY }

  // Fallback to radial-difference model
  const rA = radAU(A)
  const rB = radAU(B)
  if (rA != null && rB != null) {
    const au = Math.abs(rA - rB)
    return { au, ly: au / AU_PER_LY }
  }

  // Unknown case
  return null
}

const initialState = {
  // Cached trip distance (origin -> destination)
  distance: null, // { au: number, ly: number } | null
}

export const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    // Recompute travel distance based on current origin and destination
    computeDistance: (state, action) => {
      const { origin, destination } = action.payload
      state.distance = computeTripDistance(origin, destination)
    },
    clearDistance: (state) => {
      state.distance = null
    },
  },
})

export const { computeDistance, clearDistance } = travelSlice.actions

export const selectTravelDistance = (state) => state.travel.distance

export default travelSlice.reducer

