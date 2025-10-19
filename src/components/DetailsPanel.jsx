// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/DetailsPanel.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deselect } from '../features/space/spaceSlice'
import { planets, stars } from '../data/spaceData'

export default function DetailsPanel() {
  const selected = useSelector((state) => state.space.selected)
  const dispatch = useDispatch()

  if (!selected) return null

  const getDetails = (name) => {
    if (name === 'Sun' || name === 'Sol (Our Sun)') return {
      name: 'Sun',
      type: 'G-type Star',
      distance: '0 AU',
      description: 'Our home star! Contains 99.86% of the solar system\'s mass.',
      exoplanets: 8,
      motion: null
    }
    const planet = planets.find(p => p.name === name)
    if (planet) return {
      name: planet.name,
      type: 'Planet',
      distance: `${planet.distance} AU from Sun`,
      description: `A planet in our solar system.`
    }

    // Check if it's a moon
    for (const planet of planets) {
      const moon = planet.moons?.find(m => m.name === name)
      if (moon) return {
        name: moon.name,
        type: 'Natural Satellite',
        distance: `${moon.distance} AU from ${planet.name}`,
        description: moon.facts
      }
    }

    const star = stars.find(s => s.name === name)
    if (star) return {
      name: star.name,
      type: star.type,
      distance: `${star.distance} light years from Sun`,
      exoplanets: star.exoplanets,
      habitableZonePlanets: star.habitableZonePlanets,
      motion: star.motion,
      closestApproach: star.closestApproach,
      description: star.facts
    }
    return null
  }

  const details = getDetails(selected)
  if (!details) return null

  const { name, type, distance, description, exoplanets, habitableZonePlanets, motion, closestApproach } = details

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      background: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '350px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>{name}</h3>
        <button
          onClick={() => dispatch(deselect())}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 5px'
          }}
          aria-label="Close details"
        >×</button>
      </div>

      <p style={{ margin: '5px 0' }}><strong>Type:</strong> {type}</p>
      <p style={{ margin: '5px 0' }}><strong>Distance:</strong> {distance}</p>

      {exoplanets !== undefined && (
        <>
          <p style={{ margin: '5px 0' }}>
            <strong>Exoplanets:</strong> {exoplanets}
            {habitableZonePlanets > 0 && (
              <span style={{ color: '#4caf50', marginLeft: '8px' }}>
                🌍 {habitableZonePlanets} in habitable zone!
              </span>
            )}
          </p>
          {motion && (
            <p style={{ margin: '5px 0' }}>
              <strong>Motion:</strong>{' '}
              <span style={{ color: motion === 'approaching' ? '#64b5f6' : '#ff8a65' }}>
                {motion === 'approaching' ? '→ Approaching' : '← Receding'}
              </span>
            </p>
          )}
          {closestApproach && closestApproach !== 'moving away' && (
            <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#ffeb3b' }}>
              <strong>Closest approach:</strong> {closestApproach}
            </p>
          )}
        </>
      )}

      <p style={{ margin: '10px 0 0 0', lineHeight: '1.4' }}>{description}</p>
    </div>
  )
}
