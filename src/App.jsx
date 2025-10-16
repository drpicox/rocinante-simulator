/**
 * Main App Component
 *
 * Full-screen space flight calculator with floating panels
 */

import React, { useState, useMemo } from 'react'
import { Rocket, Settings, Info, Gauge } from 'lucide-react'
import { useVoyageCalculation, calculateJourney } from './voyage-calculation'
import { ShipConfiguration } from './ship-configuration/components/ShipConfiguration'
import { VoyageInfo } from './voyage-info/components/VoyageInfo'
import { FullScreenMap } from './celestial-map/components/FullScreenMap'
import { FloatingPanel } from './ui/components/FloatingPanel'
import { usePlanetPositions } from './celestial-map/hooks/usePlanetPositions'
import { NEARBY_STARS } from './celestial-map/data/stars'
import { formatDistance, formatSpeed, formatTime } from './ui/utils/formatters'
import {
  DEFAULT_DRY_MASS_TONS,
  DEFAULT_WET_MASS_TONS,
  DEFAULT_ACCELERATION_G,
  DEFAULT_FUSION_EFFICIENCY,
  DEFAULT_PROPULSIVE_EFFICIENCY,
  TONS_TO_KG
} from './constants/physics'

function App() {
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [showShipConfig, setShowShipConfig] = useState(false)
  const [showVoyageInfo, setShowVoyageInfo] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  // Get planet positions for current date
  const planetPositions = usePlanetPositions(new Date(), false)

  // Initialize voyage calculation with default parameters
  const { uiState, params, results } = useVoyageCalculation({
    dryMass: DEFAULT_DRY_MASS_TONS,
    wetMass: DEFAULT_WET_MASS_TONS,
    acceleration: DEFAULT_ACCELERATION_G,
    fusionEfficiency: DEFAULT_FUSION_EFFICIENCY,
    propulsiveEfficiency: DEFAULT_PROPULSIVE_EFFICIENCY
  })

  // Calculate fuel mass for display
  const fuelMass = uiState.wetMassUI - uiState.dryMassUI

  // Calculate journey for selected destination (planet or star)
  const selectedJourney = useMemo(() => {
    if (!selectedDestination) return null

    // Check if it's a planet
    const planet = planetPositions?.find(p => p.name === selectedDestination)
    if (planet) {
      const journey = calculateJourney({
        distanceAU: planet.distanceAU,
        maxRangeMeters: results.totalDist,
        maxBurnTime: results.totalTime,
        accelerationG: params.acceleration,
        wetMassKg: params.wetMass * TONS_TO_KG,
        dryMassKg: params.dryMass * TONS_TO_KG,
        exhaustVelocity: results.vExhaust
      })

      return {
        name: planet.name,
        distance: planet.distanceAU,
        ...journey
      }
    }

    // Check if it's a star
    const star = NEARBY_STARS.find(s => s.name === selectedDestination)
    if (star) {
      const journey = calculateJourney({
        distanceAU: star.distanceAU,
        maxRangeMeters: results.totalDist,
        maxBurnTime: results.totalTime,
        accelerationG: params.acceleration,
        wetMassKg: params.wetMass * TONS_TO_KG,
        dryMassKg: params.dryMass * TONS_TO_KG,
        exhaustVelocity: results.vExhaust
      })

      return {
        name: star.name,
        distance: star.distanceAU,
        ...journey
      }
    }

    return null
  }, [selectedDestination, planetPositions, results, params])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-Screen Map */}
      <FullScreenMap
        maxRangeAU={results.distAU}
        selectedDestination={selectedDestination}
        onSelectDestination={setSelectedDestination}
        selectedJourney={selectedJourney}
      />

      {/* Header with title and toggle buttons - Top Left */}
      <div className="absolute top-4 left-4 z-40">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-600 rounded-xl shadow-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Rocinante
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Space Flight Calculator
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowShipConfig(!showShipConfig)}
            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 ${
              showShipConfig
                ? 'bg-blue-600/90 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            } backdrop-blur-sm`}
          >
            <Settings className="w-4 h-4" />
            Ship Config
          </button>
          <button
            onClick={() => setShowVoyageInfo(!showVoyageInfo)}
            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 ${
              showVoyageInfo
                ? 'bg-emerald-600/90 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            } backdrop-blur-sm`}
          >
            <Gauge className="w-4 h-4" />
            Performance
          </button>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 ${
              showAbout
                ? 'bg-purple-600/90 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            } backdrop-blur-sm`}
          >
            <Info className="w-4 h-4" />
            About
          </button>
        </div>
      </div>

      {/* Floating Panels */}
      <FloatingPanel
        title="Ship Configuration"
        icon={Settings}
        isOpen={showShipConfig}
        onClose={() => setShowShipConfig(false)}
        position="right"
        maxWidth="max-w-2xl"
      >
        <ShipConfiguration
          uiState={uiState}
          fuelMass={fuelMass}
        />
      </FloatingPanel>

      <FloatingPanel
        title="Performance Metrics"
        icon={Gauge}
        isOpen={showVoyageInfo}
        onClose={() => setShowVoyageInfo(false)}
        position="right"
        maxWidth="max-w-3xl"
      >
        <VoyageInfo results={results} />
      </FloatingPanel>

      <FloatingPanel
        title="About"
        icon={Info}
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        position="right"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Physics Engine</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Tsiolkovsky rocket equation with fusion drives</li>
              <li>Special relativity (time dilation, Lorentz factors)</li>
              <li>Constant acceleration trajectories</li>
              <li>Coast phase calculations for long distances</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Astronomical Data</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Real Keplerian orbital elements (NASA JPL)</li>
              <li>Accurate planet positions for any date</li>
              <li>30+ nearest stars (Hipparcos/Gaia catalogs)</li>
              <li>Proper motion and spectral classification</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Features</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>11 progressive zoom levels (ISS to 15 light years)</li>
              <li>Smart level-of-detail rendering</li>
              <li>Real-time journey calculations</li>
              <li>Range visualization</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 italic">
              "It reaches out... 113 times a second, it reaches out." - The Expanse
            </p>
          </div>
        </div>
      </FloatingPanel>

      {/* Quick Stats - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 px-4 py-3 bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Quick Stats</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="text-slate-500">Max Range:</div>
          <div className="font-semibold text-cyan-300">{formatDistance(results.distAU, false)}</div>
          <div className="text-slate-500">Max Speed:</div>
          <div className="font-semibold text-red-300">{formatSpeed(results.vMaxKms)}</div>
          <div className="text-slate-500">Max Burn:</div>
          <div className="font-semibold text-emerald-300">{formatTime(results.totalDays)}</div>
          <div className="text-slate-500">Fuel:</div>
          <div className="font-semibold text-orange-300">{fuelMass.toFixed(0)} tons</div>
        </div>
      </div>
    </div>
  )
}

export default App
