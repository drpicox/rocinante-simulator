/**
 * FullScreenMap Component
 *
 * Full-screen celestial map with interactive controls
 */

import React from 'react'
import { ZoomIn, ZoomOut, Target, AlertTriangle } from 'lucide-react'
import { useZoom, auToPixels } from '../hooks/useZoom'
import { useVisibility } from '../hooks/useVisibility'
import { usePlanetPositions } from '../hooks/usePlanetPositions'
import { formatTime, formatDistance, formatSpeed, formatPercent } from '../../ui/utils/formatters'

export function FullScreenMap({
  maxRangeAU,
  selectedDestination,
  onSelectDestination,
  selectedJourney
}) {
  const currentDate = new Date()
  const zoom = useZoom(4) // Start at mid-solar for better inner system view
  const planetPositions = usePlanetPositions(currentDate, false)
  const visibility = useVisibility(zoom.currentLevel, planetPositions)

  const viewportSize = 2000 // Larger for better resolution

  // Center of viewport
  const cx = viewportSize / 2
  const cy = viewportSize / 2

  const handlePlanetClick = (planet) => {
    onSelectDestination(planet.name)
  }

  const handleStarClick = (star) => {
    onSelectDestination(star.name)
  }

  const handleClearSelection = () => {
    onSelectDestination(null)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Zoom Controls - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={zoom.zoomIn}
          disabled={!zoom.canZoomIn}
          className={`p-3 rounded-lg font-medium transition-all shadow-lg ${
            zoom.canZoomIn
              ? 'bg-cyan-600/90 text-white hover:bg-cyan-500 backdrop-blur-sm'
              : 'bg-slate-800/50 text-slate-600 cursor-not-allowed backdrop-blur-sm'
          }`}
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={zoom.zoomOut}
          disabled={!zoom.canZoomOut}
          className={`p-3 rounded-lg font-medium transition-all shadow-lg ${
            zoom.canZoomOut
              ? 'bg-cyan-600/90 text-white hover:bg-cyan-500 backdrop-blur-sm'
              : 'bg-slate-800/50 text-slate-600 cursor-not-allowed backdrop-blur-sm'
          }`}
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        {selectedDestination && (
          <button
            onClick={handleClearSelection}
            className="p-3 rounded-lg font-medium transition-all shadow-lg bg-orange-600/90 text-white hover:bg-orange-500 backdrop-blur-sm"
            title="Clear Selection"
          >
            <Target className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Zoom Level Indicator - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Zoom Level</div>
        <div className="text-sm font-semibold text-cyan-300">{zoom.currentLevel.name}</div>
        <div className="text-xs text-slate-500 mt-1">
          Max: {zoom.currentLevel.maxDistance.toFixed(2)} AU
        </div>
      </div>

      {/* Selected Journey Info - Bottom Center */}
      {selectedJourney && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 bg-slate-900/90 backdrop-blur-md border border-cyan-600 rounded-lg shadow-2xl max-w-2xl">
          <div className="flex items-start gap-4">
            {selectedJourney.coastPhase && (
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="text-sm font-semibold text-white mb-2">
                Journey to {selectedJourney.name}
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                <div>
                  <div className="text-slate-400">Distance</div>
                  <div className="font-semibold text-white">
                    {selectedJourney.distance ? formatDistance(selectedJourney.distance, selectedJourney.distance > 10000) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Earth Time</div>
                  <div className="font-semibold text-emerald-300">
                    {selectedJourney.totalDays ? formatTime(selectedJourney.totalDays) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Ship Time</div>
                  <div className="font-semibold text-cyan-300">
                    {selectedJourney.properDays ? formatTime(selectedJourney.properDays) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Max Speed</div>
                  <div className="font-semibold text-red-300">
                    {selectedJourney.vMax ? formatSpeed(selectedJourney.vMax) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Fuel Used</div>
                  <div className="font-semibold text-orange-300">
                    {selectedJourney.fuelPercent ? formatPercent(selectedJourney.fuelPercent) : 'N/A'}
                  </div>
                </div>
                {selectedJourney.coastPhase && (
                  <div>
                    <div className="text-slate-400">Coast</div>
                    <div className="font-semibold text-yellow-300">
                      {selectedJourney.coastDays ? formatTime(selectedJourney.coastDays) : 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main SVG Map */}
      <svg viewBox={`0 0 ${viewportSize} ${viewportSize}`} className="w-full h-full">
        <defs>
          <radialGradient id="sunGradient">
            <stop offset="0%" stopColor="#FDB813" stopOpacity="1" />
            <stop offset="100%" stopColor="#FDB813" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* Central body (Sun) */}
        <circle cx={cx} cy={cy} r="60" fill="url(#sunGradient)" />
        <circle cx={cx} cy={cy} r="35" fill="#FDB813" />
        <text
          x={cx}
          y={cy + 80}
          textAnchor="middle"
          fill="#FDB813"
          fontSize="20"
          fontWeight="bold"
        >
          Sun
        </text>

        {/* Max range circle (ship's range without coast) */}
        {maxRangeAU > 0 && visibility.viewType !== 'stellar' && (
          <>
            <circle
              cx={cx}
              cy={cy}
              r={auToPixels(maxRangeAU, zoom.currentLevel, viewportSize)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              opacity="0.5"
              strokeDasharray="12,12"
            />
            <circle
              cx={cx}
              cy={cy}
              r={auToPixels(maxRangeAU, zoom.currentLevel, viewportSize)}
              fill="#22c55e"
              opacity="0.05"
            />
          </>
        )}

        {/* Planet orbits */}
        {visibility.visiblePlanets.map((planet, idx) => {
          if (planet.name === 'Earth') return null
          const radius = auToPixels(planet.distanceAU, zoom.currentLevel, viewportSize)
          if (radius > viewportSize || radius < 0) return null

          return (
            <circle
              key={`orbit-${idx}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeDasharray="6,6"
              opacity="0.4"
            />
          )
        })}

        {/* Planets */}
        {visibility.visiblePlanets.map((planet, idx) => {
          const r = auToPixels(planet.distanceAU, zoom.currentLevel, viewportSize)
          if (r > viewportSize / 2 || r < 0) return null

          // Special handling for Earth (at origin)
          const angleRad = planet.name === 'Earth' ? 0 : (planet.angle * Math.PI) / 180
          const x = planet.name === 'Earth' ? cx : cx + r * Math.cos(angleRad)
          const y = planet.name === 'Earth' ? cy : cy + r * Math.sin(angleRad)

          const isInRange = planet.distanceAU <= maxRangeAU
          const isSelected = selectedDestination === planet.name
          // Better size calculation for visibility
          const baseSize = planet.name === 'Earth' ? 16 : Math.max(10, Math.min(20, planet.radius / 3000))
          const size = Math.max(12, baseSize + zoom.currentLevel.minObjectSize)

          return (
            <g
              key={idx}
              onClick={() => handlePlanetClick(planet)}
              className="cursor-pointer"
              style={{ transition: 'all 0.3s' }}
            >
              {isSelected && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 15}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                  >
                    <animate
                      attributeName="r"
                      values={`${size + 12};${size + 18};${size + 12}`}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    opacity="0.6"
                  />
                </>
              )}

              {isInRange && (
                <circle
                  cx={x}
                  cy={y}
                  r={size + 6}
                  fill={planet.color}
                  opacity="0.3"
                />
              )}

              <circle
                cx={x}
                cy={y}
                r={size}
                fill={planet.color}
                stroke={isInRange ? '#22c55e' : '#94a3b8'}
                strokeWidth="3"
                opacity={isInRange ? 1 : 0.6}
              />

              {visibility.showLabels.planets && (
                <text
                  x={x}
                  y={y - size - 12}
                  textAnchor="middle"
                  fill={isSelected ? '#60a5fa' : planet.color}
                  fontSize="16"
                  fontWeight={isSelected ? 'bold' : '600'}
                >
                  {planet.name}
                </text>
              )}
            </g>
          )
        })}

        {/* Stars (if in stellar view) */}
        {visibility.visibleStars.map((star, idx) => {
          const r = auToPixels(star.distanceAU, zoom.currentLevel, viewportSize)
          if (r > viewportSize / 2 || r < 0) return null

          // Simplified 2D projection
          const angleRad = (star.rightAscension * Math.PI) / 180
          const x = cx + r * Math.cos(angleRad)
          const y = cy + r * Math.sin(angleRad)

          const size = Math.max(6, 12 - star.apparentMagnitude / 2)
          const isSelected = selectedDestination === star.name

          return (
            <g
              key={`star-${idx}`}
              onClick={() => handleStarClick(star)}
              className="cursor-pointer"
              style={{ transition: 'all 0.3s' }}
            >
              {isSelected && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 15}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                  >
                    <animate
                      attributeName="r"
                      values={`${size + 12};${size + 18};${size + 12}`}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    opacity="0.6"
                  />
                </>
              )}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={star.color}
                opacity="0.9"
                stroke={isSelected ? '#60a5fa' : 'none'}
                strokeWidth="2"
              />
              {visibility.showLabels.stars && (
                <text
                  x={x}
                  y={y - size - 8}
                  textAnchor="middle"
                  fill={isSelected ? '#60a5fa' : star.color}
                  fontSize="14"
                  fontWeight={isSelected ? 'bold' : '600'}
                >
                  {star.name}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
