// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/DetailsPanel.jsx
import React from 'react'

export default function DetailsPanel({ details, onClose }) {
  if (!details) return null

  const {
    name,
    type,
    distance,
    description,
    exoplanets,
    habitableZonePlanets,
    motion,
    closestApproach,
  } = details

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
          onClick={onClose}
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

