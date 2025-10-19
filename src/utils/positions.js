// filepath: /Volumes/Projects/claude/rocinante-simulator/src/utils/positions.js
import { planets, stars } from '../data/spaceData'

// Compute orbital position for a planet at a given time
export function getPlanetPosition(planetName, elapsedTime) {
  const planet = planets.find(p => p.name === planetName)
  if (!planet) return null

  const orbitRadius = planet.distance * 10
  const orbitSpeed = 0.1 / planet.distance

  const x = Math.sin(elapsedTime * orbitSpeed) * orbitRadius
  const z = Math.cos(elapsedTime * orbitSpeed) * orbitRadius

  return [x, 0, z]
}

// Compute moon position relative to its planet at a given time
export function getMoonPosition(moonName, elapsedTime) {
  for (const planet of planets) {
    const moon = planet.moons?.find(m => m.name === moonName)
    if (moon) {
      // Get planet position first
      const planetPos = getPlanetPosition(planet.name, elapsedTime)
      if (!planetPos) return null

      // Moon orbits around its planet
      const moonOrbitRadius = moon.distance * 250
      const moonOrbitSpeed = 0.3

      const moonX = Math.cos(elapsedTime * moonOrbitSpeed) * moonOrbitRadius
      const moonZ = Math.sin(elapsedTime * moonOrbitSpeed) * moonOrbitRadius

      return [
        planetPos[0] + moonX,
        planetPos[1],
        planetPos[2] + moonZ
      ]
    }
  }
  return null
}

// Get 3D position for any celestial object at a given time
export function getPosition(name, elapsedTime = 0) {
  if (!name) return null

  // Normalize name
  const canonical = name === 'Sol (Our Sun)' ? 'Sun' : name

  // Sun is at origin
  if (canonical === 'Sun') return [0, 0, 0]

  // Check if it's a planet
  const planet = planets.find(p => p.name === canonical)
  if (planet) {
    return getPlanetPosition(canonical, elapsedTime)
  }

  // Check if it's a moon
  for (const p of planets) {
    const moon = p.moons?.find(m => m.name === canonical)
    if (moon) {
      return getMoonPosition(canonical, elapsedTime)
    }
  }

  // Check if it's a star (stars don't move)
  const star = stars.find(s => s.name === canonical)
  if (star) {
    // Stars use their x,y,z scaled by 2000 (as in App.jsx)
    return [star.x * 2000, star.y * 2000, star.z * 2000]
  }

  return null
}

