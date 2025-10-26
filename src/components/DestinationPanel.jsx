// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/DestinationPanel.jsx
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearDestination, selectDestination } from '../features/destination/destinationSlice'
import { planets, stars } from '../data/spaceData'
import { selectOrigin } from '../features/origin/originSlice'
import { selectTravelDistance, computeDistance } from '../features/travel/travelSlice'
import { calculateTravel, formatTime, formatMass } from '../utils/travel'
import { LCARS_COLORS, LCARS_FONTS, LCARS_RADIUS } from '../styles/lcars'

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
      background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95), rgba(34, 34, 34, 0.92))',
      color: LCARS_COLORS.textPrimary,
      padding: isExpanded ? '0' : '12px 16px',
      borderRadius: LCARS_RADIUS.large,
      maxWidth: isExpanded ? '380px' : '280px',
      backdropFilter: 'blur(10px)',
      border: `3px solid ${LCARS_COLORS.purple}`,
      boxShadow: `0 0 20px rgba(204, 153, 204, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      minWidth: '280px',
      fontFamily: LCARS_FONTS.primary,
      overflow: 'hidden'
    }}>
      {/* LCARS Header Bar */}
      {isExpanded && (
        <div style={{
          background: LCARS_COLORS.purple,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: `${LCARS_RADIUS.large} ${LCARS_RADIUS.large} 0 0`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: LCARS_COLORS.black,
              borderRadius: LCARS_RADIUS.pill,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>▼</div>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: LCARS_FONTS.weight.bold,
              color: LCARS_COLORS.black,
              textTransform: 'uppercase',
              letterSpacing: '2px'
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
                background: LCARS_COLORS.black,
                border: 'none',
                borderRadius: LCARS_RADIUS.pill,
                color: LCARS_COLORS.purple,
                fontSize: '20px',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = LCARS_COLORS.orange
                e.currentTarget.style.color = LCARS_COLORS.black
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = LCARS_COLORS.black
                e.currentTarget.style.color = LCARS_COLORS.purple
              }}
              aria-label="Close details"
            >×</button>
          )}
        </div>
      )}
      
      {/* Toggle Button for collapsed state */}
      {!isExpanded && (
        <button
          onClick={togglePanel}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: LCARS_COLORS.purple,
            cursor: 'pointer',
            padding: 0,
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '20px',
              color: LCARS_COLORS.purple
            }}>▶</span>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: LCARS_FONTS.weight.bold,
              color: LCARS_COLORS.purple,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {hasContent ? name : 'Target'}
            </h3>
          </div>
        </button>
      )}

      {/* Expandable Content */}
      <div style={{
        maxHeight: isExpanded ? '500px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: isExpanded ? 'auto' : 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'top',
        padding: isExpanded ? '20px' : '0'
      }}>
        {!hasContent ? (
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
            color: LCARS_COLORS.purple,
            fontStyle: 'italic'
          }}>
            <p style={{ margin: '8px 0', fontSize: '32px' }}>✨</p>
            <p style={{ margin: '8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Click on a celestial object to view details
            </p>
          </div>
        ) : (
          <div>
            {/* LCARS Divider */}
            <div style={{
              height: '3px',
              background: LCARS_COLORS.purple,
              borderRadius: LCARS_RADIUS.small,
              margin: '0 0 16px 0'
            }} />
            
            <div style={{
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: LCARS_RADIUS.medium,
              border: `2px solid ${LCARS_COLORS.purpleLight}`,
              marginBottom: '12px'
            }}>
              <p style={{ margin: '5px 0' }}>
                <strong style={{ 
                  color: LCARS_COLORS.orange,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '11px'
                }}>Type:</strong>{' '}
                <span style={{ color: LCARS_COLORS.textPrimary }}>{type}</span>
              </p>
              {tripDisplay && (
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ 
                    color: LCARS_COLORS.orange,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '11px'
                  }}>Trip distance:</strong>{' '}
                  <span style={{ color: LCARS_COLORS.textPrimary }}>{tripDisplay}</span>
                </p>
              )}
              <p style={{ margin: '5px 0' }}>
                <strong style={{ 
                  color: LCARS_COLORS.orange,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '11px'
                }}>Distance:</strong>{' '}
                <span style={{ color: LCARS_COLORS.textPrimary }}>{distance}</span>
              </p>

              {exoplanets !== undefined && (
                <>
                  <p style={{ margin: '5px 0' }}>
                    <strong style={{ 
                      color: LCARS_COLORS.orange,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '11px'
                    }}>Exoplanets:</strong>{' '}
                    <span style={{ color: LCARS_COLORS.textPrimary }}>{exoplanets}</span>
                    {habitableZonePlanets > 0 && (
                      <span style={{
                        color: LCARS_COLORS.success,
                        marginLeft: '8px',
                        fontWeight: '600'
                      }}>
                        🌍 {habitableZonePlanets} in habitable zone!
                      </span>
                    )}
                  </p>
                  {motion && (
                    <p style={{ margin: '5px 0' }}>
                      <strong style={{ 
                        color: LCARS_COLORS.orange,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '11px'
                      }}>Motion:</strong>{' '}
                      <span style={{
                        color: motion === 'approaching' ? LCARS_COLORS.blueLight : LCARS_COLORS.orangeBright,
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
                      color: LCARS_COLORS.black,
                      padding: '8px',
                      background: LCARS_COLORS.orangeBright,
                      borderRadius: LCARS_RADIUS.medium,
                      fontWeight: '600'
                    }}>
                      <strong>Closest approach:</strong> {closestApproach}
                    </p>
                  )}
                </>
              )}
            </div>

            <p style={{
              margin: '0 0 12px 0',
              lineHeight: '1.5',
              color: LCARS_COLORS.textPrimary,
              fontSize: '14px',
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: LCARS_RADIUS.medium,
              borderLeft: `4px solid ${LCARS_COLORS.purple}`
            }}>
              {description}
            </p>

            {/* Travel Information */}
            {travelInfo && (
              <div style={{
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: LCARS_RADIUS.medium,
                border: `2px solid ${LCARS_COLORS.pink}`,
              }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '15px',
                  fontWeight: LCARS_FONTS.weight.bold,
                  color: LCARS_COLORS.pink,
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  🚀 Travel Profile
                </h4>
                <div style={{ fontSize: '13px' }}>
                  <p style={{ margin: '4px 0' }}>
                    <strong style={{ 
                      color: LCARS_COLORS.orange,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '11px'
                    }}>Observer time:</strong>{' '}
                    <span style={{ color: LCARS_COLORS.textPrimary }}>{formatTime(travelInfo.observerTime)}</span>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong style={{ 
                      color: LCARS_COLORS.orange,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '11px'
                    }}>Ship time:</strong>{' '}
                    <span style={{ color: LCARS_COLORS.textPrimary }}>{formatTime(travelInfo.shipTime)}</span>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong style={{ 
                      color: LCARS_COLORS.orange,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '11px'
                    }}>Fuel consumed:</strong>{' '}
                    <span style={{ color: LCARS_COLORS.textPrimary }}>{formatMass(travelInfo.fuelConsumed)}</span>
                  </p>
                  {!travelInfo.hasEnoughFuel && travelInfo.coastTime > 0 && (
                    <>
                      <p style={{ margin: '4px 0' }}>
                        <strong style={{ 
                          color: LCARS_COLORS.orange,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          fontSize: '11px'
                        }}>Coast time:</strong>{' '}
                        <span style={{ color: LCARS_COLORS.textPrimary }}>{formatTime(travelInfo.coastTime)}</span>
                      </p>
                      <p style={{
                        margin: '8px 0 0 0',
                        fontSize: '0.85em',
                        color: LCARS_COLORS.black,
                        padding: '6px',
                        background: LCARS_COLORS.orangeBright,
                        borderRadius: LCARS_RADIUS.small,
                        fontWeight: '600'
                      }}>
                        ⚠️ Insufficient fuel for constant acceleration
                      </p>
                    </>
                  )}
                  <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '11px',
                    color: LCARS_COLORS.purple,
                    textAlign: 'right',
                    fontStyle: 'italic'
                  }}>
                    Calculations based on{' '}
                    <a
                      href="https://math.ucr.edu/home/baez/physics/Relativity/SR/Rocket/rocket.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: LCARS_COLORS.blueLight,
                        textDecoration: 'none',
                        borderBottom: `1px dotted ${LCARS_COLORS.blueLight}`,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = LCARS_COLORS.blue
                        e.currentTarget.style.borderBottomStyle = 'solid'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = LCARS_COLORS.blueLight
                        e.currentTarget.style.borderBottomStyle = 'dotted'
                      }}
                    >
                      relativistic rocket physics
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom expand/collapse button */}
      {isExpanded && (
        <div style={{
          background: LCARS_COLORS.purple,
          padding: '8px',
          borderRadius: `0 0 ${LCARS_RADIUS.large} ${LCARS_RADIUS.large}`,
          display: 'flex',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={togglePanel}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = LCARS_COLORS.purpleLight
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = LCARS_COLORS.purple
        }}
        >
          <div style={{
            width: '60px',
            height: '4px',
            background: LCARS_COLORS.black,
            borderRadius: LCARS_RADIUS.pill,
          }} />
        </div>
      )}
    </div>
  )
}
