// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/DestinationPanel.jsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearDestination, selectDestination } from '../features/destination/destinationSlice'
import { planets, stars } from '../data/spaceData'
import { selectOrigin } from '../features/origin/originSlice'
import { selectTravelDistance, computeDistance } from '../features/travel/travelSlice'
import { calculateTravel, formatTime, formatMass } from '../utils/travel'

export default function DestinationPanel() {
  const destination = useSelector(selectDestination)
  const origin = useSelector(selectOrigin)
  const tripDistance = useSelector(selectTravelDistance)
  const ship = useSelector((state) => state.ship)
  const dispatch = useDispatch()
  const [isExpanded, setIsExpanded] = useState(true)

  // Recompute travel distance whenever origin or destination changes
  useEffect(() => {
    dispatch(computeDistance({ origin: origin?.name, destination }))
  }, [origin?.name, destination, dispatch])

  // Compute details for the selected object (for panel fields)
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

  const details = destination ? getDetails(destination) : null
  const hasContent = !!details

  const formatSig = (v) => {
    if (!isFinite(v)) return '—'
    if (v === 0) return '0'
    // Two significant digits max
    return Number(v.toPrecision(2)).toString()
  }

  let tripDisplay = null
  let travelInfo = null
  if (tripDistance) {
    const useLy = tripDistance.ly > 0.01
    tripDisplay = useLy
      ? `${formatSig(tripDistance.ly)} ly`
      : `${formatSig(tripDistance.au)} AU`

    // Calculate travel information
    const AU = 149597870700 // 1 AU in meters
    const distanceMeters = tripDistance.au * AU
    travelInfo = calculateTravel(
      distanceMeters,
      ship.mass,
      ship.fuel,
      ship.efficiency,
      ship.acceleration
    )
  }

  const togglePanel = () => {
    setIsExpanded(!isExpanded)
  }

  const { name, type, distance, description, exoplanets, habitableZonePlanets, motion, closestApproach } = details || {}

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      background: isExpanded
        ? 'linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 20, 60, 0.92))'
        : 'linear-gradient(135deg, rgba(20, 20, 40, 0.85), rgba(40, 20, 60, 0.82))',
      color: 'white',
      padding: isExpanded ? '20px' : '12px 16px',
      borderRadius: '12px',
      maxWidth: isExpanded ? '380px' : '280px',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      boxShadow: isExpanded
        ? '0 8px 32px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1) inset'
        : '0 4px 16px rgba(139, 92, 246, 0.15)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      minWidth: '280px'
    }}>
      {/* Toggle Button */}
      <button
        onClick={togglePanel}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded && hasContent ? '12px' : '0'
        }}
        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '20px',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            display: 'inline-block',
            color: '#a78bfa'
          }}>▼</span>
          <h3 style={{
            margin: 0,
            fontSize: isExpanded ? '18px' : '16px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'font-size 0.3s ease'
          }}>
            {hasContent ? name : 'Target'}
          </h3>
        </div>
        {hasContent && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch(clearDestination())
            }}
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '6px',
              color: '#a78bfa',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px 10px',
              transition: 'all 0.2s ease',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.35)'
              e.currentTarget.style.color = '#c4b5fd'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
              e.currentTarget.style.color = '#a78bfa'
            }}
            aria-label="Close details"
          >×</button>
        )}
      </button>

      {/* Expandable Content */}
      <div style={{
        maxHeight: isExpanded ? '500px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'top'
      }}>
        {!hasContent ? (
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
            color: 'rgba(167, 139, 250, 0.7)',
            fontStyle: 'italic'
          }}>
            <p style={{ margin: '8px 0', fontSize: '32px' }}>✨</p>
            <p style={{ margin: '8px 0' }}>Click on a celestial object to view details</p>
          </div>
        ) : (
          <div style={{ paddingTop: '8px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(139, 92, 246, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              marginBottom: '12px'
            }}>
              <p style={{ margin: '5px 0' }}>
                <strong style={{ color: '#c4b5fd' }}>Type:</strong>{' '}
                <span style={{ color: '#e9d5ff' }}>{type}</span>
              </p>
              {tripDisplay && (
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: '#c4b5fd' }}>Trip distance:</strong>{' '}
                  <span style={{ color: '#e9d5ff' }}>{tripDisplay}</span>
                </p>
              )}
              <p style={{ margin: '5px 0' }}>
                <strong style={{ color: '#c4b5fd' }}>Distance:</strong>{' '}
                <span style={{ color: '#e9d5ff' }}>{distance}</span>
              </p>

              {exoplanets !== undefined && (
                <>
                  <p style={{ margin: '5px 0' }}>
                    <strong style={{ color: '#c4b5fd' }}>Exoplanets:</strong>{' '}
                    <span style={{ color: '#e9d5ff' }}>{exoplanets}</span>
                    {habitableZonePlanets > 0 && (
                      <span style={{
                        color: '#4ade80',
                        marginLeft: '8px',
                        fontWeight: '600'
                      }}>
                        🌍 {habitableZonePlanets} in habitable zone!
                      </span>
                    )}
                  </p>
                  {motion && (
                    <p style={{ margin: '5px 0' }}>
                      <strong style={{ color: '#c4b5fd' }}>Motion:</strong>{' '}
                      <span style={{
                        color: motion === 'approaching' ? '#60a5fa' : '#fb923c',
                        fontWeight: '600'
                      }}>
                        {motion === 'approaching' ? '→ Approaching' : '← Receding'}
                      </span>
                    </p>
                  )}
                  {closestApproach && closestApproach !== 'moving away' && (
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '0.9em',
                      color: '#fbbf24',
                      padding: '8px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      borderRadius: '6px',
                      borderLeft: '3px solid #fbbf24'
                    }}>
                      <strong>Closest approach:</strong> {closestApproach}
                    </p>
                  )}
                </>
              )}
            </div>

            <p style={{
              margin: '0',
              lineHeight: '1.5',
              color: '#e9d5ff',
              fontSize: '14px',
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              borderLeft: '3px solid rgba(167, 139, 250, 0.5)'
            }}>
              {description}
            </p>

            {/* Travel Information */}
            {travelInfo && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(236, 72, 153, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(236, 72, 153, 0.15)',
              }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#f9a8d4'
                }}>
                  🚀 Travel Profile
                </h4>
                <div style={{ fontSize: '13px' }}>
                  <p style={{ margin: '4px 0' }}>
                    <strong style={{ color: '#fbb6ce' }}>Observer time:</strong>{' '}
                    <span style={{ color: '#fce7f3' }}>{formatTime(travelInfo.observerTime)}</span>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong style={{ color: '#fbb6ce' }}>Ship time:</strong>{' '}
                    <span style={{ color: '#fce7f3' }}>{formatTime(travelInfo.shipTime)}</span>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong style={{ color: '#fbb6ce' }}>Fuel consumed:</strong>{' '}
                    <span style={{ color: '#fce7f3' }}>{formatMass(travelInfo.fuelConsumed)}</span>
                  </p>
                  {!travelInfo.hasEnoughFuel && travelInfo.coastTime > 0 && (
                    <>
                      <p style={{ margin: '4px 0' }}>
                        <strong style={{ color: '#fbb6ce' }}>Coast time:</strong>{' '}
                        <span style={{ color: '#fce7f3' }}>{formatTime(travelInfo.coastTime)}</span>
                      </p>
                      <p style={{
                        margin: '8px 0 0 0',
                        fontSize: '0.85em',
                        color: '#fbbf24',
                        padding: '6px',
                        background: 'rgba(251, 191, 36, 0.1)',
                        borderRadius: '4px',
                        borderLeft: '2px solid #fbbf24'
                      }}>
                        ⚠️ Insufficient fuel for constant acceleration
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
