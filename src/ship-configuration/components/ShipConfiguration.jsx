/**
 * ShipConfiguration Component
 *
 * Collapsible panel for configuring ship parameters
 */

import React, { useEffect } from 'react'
import { Rocket, Fuel, Zap, Ship, Atom } from 'lucide-react'
import { CollapsiblePanel } from '../../ui/components/CollapsiblePanel'
import { SHIP_PRESETS, ENGINE_TYPES } from '../../constants/physics'

function ParameterSlider({ label, value, onChange, min, max, step, unit, helperText, logarithmic = false }) {
  // For logarithmic sliders, convert between linear slider position and logarithmic value
  const toSliderValue = (realValue) => {
    if (!logarithmic) return realValue
    // Convert real value to slider position (0-1000 range)
    return Math.log(realValue / min) / Math.log(max / min) * 1000
  }

  const fromSliderValue = (sliderValue) => {
    if (!logarithmic) return sliderValue
    // Convert slider position to real value
    const ratio = sliderValue / 1000
    return Math.round(min * Math.pow(max / min, ratio) / step) * step
  }

  const sliderValue = logarithmic ? toSliderValue(value) : value
  const sliderMin = logarithmic ? 0 : min
  const sliderMax = logarithmic ? 1000 : max
  const sliderStep = logarithmic ? 1 : step

  const handleChange = (e) => {
    const newSliderValue = Number(e.target.value)
    const newRealValue = fromSliderValue(newSliderValue)
    onChange(newRealValue)
  }

  // Format value for display
  const formatValue = (val) => {
    // For very small values (< 0.01), use scientific notation
    if (val < 0.01 && val > 0) {
      return val.toExponential(2)
    }
    // For values >= 1, show 1 decimal place
    if (val >= 1) {
      return val.toFixed(1).replace(/\.?0+$/, '')
    }
    // For values between 0.01 and 1, show up to 2 decimal places
    return val.toFixed(2).replace(/\.?0+$/, '')
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        <span className="text-lg font-bold text-blue-400">
          {formatValue(value)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={sliderValue}
        onChange={handleChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
      {helperText && (
        <p className="text-xs text-slate-300 mt-1">{helperText}</p>
      )}
    </div>
  )
}

export function ShipConfiguration({ uiState, fuelMass }) {
  const {
    dryMassUI,
    wetMassUI,
    accelerationUI,
    fusionEfficiencyUI,
    propulsiveEfficiencyUI,
    engineTypeUI,
    setDryMassUI,
    setWetMassUI,
    setAccelerationUI,
    setFusionEfficiencyUI,
    setPropulsiveEfficiencyUI,
    setEngineTypeUI
  } = uiState

  // Get current engine type configuration
  const currentEngineType = ENGINE_TYPES[engineTypeUI]

  // Set default acceleration when engine type changes
  useEffect(() => {
    if (currentEngineType?.defaultAcceleration) {
      setAccelerationUI(currentEngineType.defaultAcceleration)
    }
  }, [engineTypeUI, currentEngineType, setAccelerationUI])

  // Handle preset selection
  const handlePresetSelect = (presetId) => {
    const preset = SHIP_PRESETS[presetId]
    if (preset) {
      setEngineTypeUI(preset.engineType)
      setDryMassUI(preset.dryMass)
      setWetMassUI(preset.wetMass)
      setAccelerationUI(preset.acceleration)
      setFusionEfficiencyUI(preset.fusionEfficiency)
      setPropulsiveEfficiencyUI(preset.propulsiveEfficiency)
    }
  }

  return (
    <div className="space-y-6">
      {/* Engine Type Selector */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Atom className="w-5 h-5 text-purple-400" />
          <h4 className="font-semibold text-white">Engine Type</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(ENGINE_TYPES).map((engineType) => (
            <button
              key={engineType.id}
              onClick={() => setEngineTypeUI(engineType.id)}
              className={`text-left p-3 rounded-lg border transition-all ${
                engineTypeUI === engineType.id
                  ? 'bg-purple-600/30 border-purple-400'
                  : 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-500 hover:border-purple-400'
              }`}
            >
              <div className="font-semibold text-purple-300 mb-1">{engineType.name}</div>
              <div className="text-xs text-slate-400">{engineType.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Ship Presets */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Ship className="w-5 h-5 text-cyan-400" />
          <h4 className="font-semibold text-white">Ship Presets</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(SHIP_PRESETS).map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className="text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500 hover:border-cyan-400 transition-all"
            >
              <div className="font-semibold text-cyan-300 mb-1">{preset.name}</div>
              <div className="text-xs text-slate-400 mb-2">{preset.description}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div className="text-slate-500">Range:</div>
                <div className="text-slate-300 font-medium">{preset.maxRange}</div>
                <div className="text-slate-500">Accel:</div>
                <div className="text-slate-300 font-medium">{preset.acceleration}g</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ship Parameters */}
      <CollapsiblePanel
        title="Ship Parameters"
        icon={Rocket}
        storageKey="ship-params-open"
        headerClassName="text-blue-300"
      >
        <div className="space-y-6">
          <ParameterSlider
            label="Dry Mass"
            value={dryMassUI}
            onChange={setDryMassUI}
            min={500}
            max={100000}
            step={1000}
            unit=" tons"
            helperText="Ship structure without fuel"
            logarithmic={true}
          />

          <ParameterSlider
            label="Wet Mass (full tanks)"
            value={wetMassUI}
            onChange={setWetMassUI}
            min={dryMassUI + 500}
            max={1000000000}
            step={10000}
            unit=" tons"
            helperText="Ship mass with full fuel load"
            logarithmic={true}
          />

          <ParameterSlider
            label="Acceleration"
            value={accelerationUI}
            onChange={setAccelerationUI}
            min={0.000001}
            max={10}
            step={0.000001}
            unit="g"
            helperText="Constant acceleration (logarithmic scale)"
            logarithmic={true}
          />

          {/* Fuel Load Display */}
          <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/30 rounded-lg p-4 border border-orange-600/50 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <Fuel className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium text-slate-200">Fuel Load</span>
            </div>
            <div className="text-2xl font-bold text-orange-300">
              {fuelMass.toFixed(0)} tons
            </div>
            <div className="text-xs text-slate-300">
              {(fuelMass / wetMassUI * 100).toFixed(1)}% of total mass
            </div>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Engine Efficiencies */}
      <CollapsiblePanel
        title="Engine Efficiencies"
        icon={Zap}
        storageKey="engine-params-open"
        headerClassName="text-yellow-300"
      >
        <div className="space-y-6">
          <ParameterSlider
            label="Mass→Energy Efficiency"
            value={fusionEfficiencyUI}
            onChange={setFusionEfficiencyUI}
            min={currentEngineType.massEnergyEfficiency.min}
            max={currentEngineType.massEnergyEfficiency.max}
            step={currentEngineType.massEnergyEfficiency.step}
            unit={currentEngineType.massEnergyEfficiency.unit}
            helperText={currentEngineType.helperText}
          />

          <ParameterSlider
            label="Propulsive Efficiency (energy→thrust)"
            value={propulsiveEfficiencyUI}
            onChange={setPropulsiveEfficiencyUI}
            min={currentEngineType.propulsiveEfficiency.min}
            max={currentEngineType.propulsiveEfficiency.max}
            step={currentEngineType.propulsiveEfficiency.step}
            unit={currentEngineType.propulsiveEfficiency.unit}
            helperText="Losses: radiation, particle escape, nozzle efficiency..."
          />

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-500 mt-4">
            <p className="text-xs text-slate-200">
              <span className="font-semibold text-slate-100">Note:</span> Higher efficiencies
              result in greater exhaust velocity and longer range. {
                engineTypeUI === 'antimatter'
                  ? 'Antimatter annihilation approaches 100% mass-energy conversion (E=mc²).'
                  : 'Fusion reactions convert 0.1-1% of mass to energy.'
              }
            </p>
          </div>
        </div>
      </CollapsiblePanel>
      </div>
    </div>
  )
}
