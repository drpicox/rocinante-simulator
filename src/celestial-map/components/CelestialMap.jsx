/**
 * CelestialMap Component
 *
 * Interactive map displaying solar system and stellar objects
 * Features click-to-select, progressive zoom, and LOD rendering
 */

import React, { useState } from 'react'
import { ZoomIn, ZoomOut, Calendar } from 'lucide-react'
import { CollapsiblePanel } from '../../ui/components/CollapsiblePanel'
import { useZoom, auToPixels } from '../hooks/useZoom'
import { useVisibility } from '../hooks/useVisibility'
import { usePlanetPositions } from '../hooks/usePlanetPositions'

export function CelestialMap({ maxRangeAU, selectedDestination, onSelectDestination }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const zoom = useZoom(5) // Start at outer-solar
  const planetPositions = usePlanetPositions(currentDate)
  const visibility = useVisibility(zoom.currentLevel, planetPositions)

  const viewportSize = 1000

  // Center of viewport
  const cx = viewportSize / 2
  const cy = viewportSize / 2

  const handlePlanetClick = (planet) => {
    onSelectDestination(planet.name)
  }

  return (
    <CollapsiblePanel
      title={`${zoom.currentLevel.name} View`}
      icon={Calendar}
      storageKey="map-open"
      headerClassName="text-cyan-300"
      defaultOpen={true}
    >
      {/* Zoom Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={zoom.zoomIn}
            disabled={!zoom.canZoomIn}
            className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              zoom.canZoomIn
                ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ZoomIn className="w-4 h-4" />
            Zoom In
          </button>
          <button
            onClick={zoom.zoomOut}
            disabled={!zoom.canZoomOut}
            className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              zoom.canZoomOut
                ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ZoomOut className="w-4 h-4" />
            Zoom Out
          </button>
        </div>

        <div className="text-sm text-slate-400">
          Level {zoom.currentLevelIndex + 1} of {zoom.totalLevels} | Max: {zoom.currentLevel.maxDistance.toFixed(2)} AU
        </div>
      </div>

      {/* Map SVG */}
      <div className="relative w-full aspect-square bg-slate-950/70 rounded-lg overflow-hidden border border-slate-700">
        <svg viewBox={`0 0 ${viewportSize} ${viewportSize}`} className="w-full h-full">
          <defs>
            <radialGradient id="sunGradient">
              <stop offset="0%" stopColor="#FDB813" stopOpacity="1" />
              <stop offset="100%" stopColor="#FDB813" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="earthGradient">
              <stop offset="0%" stopColor="#4A9EFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#4A9EFF" stopOpacity="0.3" />
            </radialGradient>
          </defs>

          {/* Central body (Sun or Earth depending on zoom) */}
          <circle cx={cx} cy={cy} r="40" fill="url(#sunGradient)" />
          <circle cx={cx} cy={cy} r="25" fill="#FDB813" />
          <text
            x={cx}
            y={cy + 60}
            textAnchor="middle"
            fill="#FDB813"
            fontSize="14"
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
                strokeWidth="3"
                opacity="0.6"
                strokeDasharray="8,8"
              />
              <circle
                cx={cx}
                cy={cy}
                r={auToPixels(maxRangeAU, zoom.currentLevel, viewportSize)}
                fill="#22c55e"
                opacity="0.08"
              />
            </>
          )}

          {/* Planet orbits */}
          {visibility.visiblePlanets.map((planet, idx) => {
            if (planet.name === 'Earth') return null
            const radius = auToPixels(planet.distance, zoom.currentLevel, viewportSize)
            if (radius > viewportSize) return null

            return (
              <circle
                key={`orbit-${idx}`}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="#475569"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            )
          })}

          {/* Planets */}
          {visibility.visiblePlanets.map((planet, idx) => {
            if (planet.name === 'Earth') return null

            const r = auToPixels(planet.distance, zoom.currentLevel, viewportSize)
            if (r > viewportSize / 2) return null

            const angleRad = (planet.angle * Math.PI) / 180
            const x = cx + r * Math.cos(angleRad)
            const y = cy + r * Math.sin(angleRad)

            const isInRange = planet.distance <= maxRangeAU
            const isSelected = selectedDestination === planet.name
            const size = zoom.currentLevel.minObjectSize + (planet.radius / 10000)

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
                      r={size + 8}
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                    >
                      <animate
                        attributeName="r"
                        values={`${size + 8};${size + 12};${size + 8}`}
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
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      opacity="0.7"
                    />
                  </>
                )}

                {isInRange && (
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 4}
                    fill={planet.color}
                    opacity="0.4"
                  />
                )}

                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={planet.color}
                  stroke={isInRange ? '#22c55e' : '#94a3b8'}
                  strokeWidth="2"
                  opacity={isInRange ? 1 : 0.6}
                />

                {visibility.showLabels.planets && (
                  <text
                    x={x}
                    y={y - size - 8}
                    textAnchor="middle"
                    fill={isSelected ? '#60a5fa' : planet.color}
                    fontSize="12"
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
            if (r > viewportSize / 2) return null

            // Simplified 2D projection - use RA/Dec to determine angle
            const angleRad = (star.rightAscension * Math.PI) / 180
            const x = cx + r * Math.cos(angleRad)
            const y = cy + r * Math.sin(angleRad)

            const size = Math.max(3, 10 - star.apparentMagnitude / 3)

            return (
              <g key={`star-${idx}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={star.color}
                  opacity="0.9"
                />
                {visibility.showLabels.stars && (
                  <text
                    x={x}
                    y={y - size - 6}
                    textAnchor="middle"
                    fill={star.color}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {star.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-8 text-sm flex-wrap">
        {visibility.viewType !== 'stellar' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-500"></div>
              <span className="text-slate-200">Within Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400 border-2 border-slate-500"></div>
              <span className="text-slate-200">Out of Range</span>
            </div>
          </>
        )}
        <button
          onClick={() => onSelectDestination(null)}
          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-slate-100 text-xs transition-colors font-medium"
        >
          Clear Selection
        </button>
      </div>
    </CollapsiblePanel>
  )
}
