/**
 * ShipConfiguration Component
 *
 * Collapsible panel for configuring ship parameters
 */

import React from 'react'
import { Rocket, Fuel, Zap, Ship } from 'lucide-react'
import { CollapsiblePanel } from '../../ui/components/CollapsiblePanel'
import { SHIP_PRESETS } from '../../constants/physics'

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

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        <span className="text-lg font-bold text-blue-400">
          {value.toLocaleString()}{unit}
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
    setDryMassUI,
    setWetMassUI,
    setAccelerationUI,
    setFusionEfficiencyUI,
    setPropulsiveEfficiencyUI
  } = uiState

  // Handle preset selection
  const handlePresetSelect = (presetId) => {
    const preset = SHIP_PRESETS[presetId]
    if (preset) {
      setDryMassUI(preset.dryMass)
      setWetMassUI(preset.wetMass)
      setAccelerationUI(preset.acceleration)
      setFusionEfficiencyUI(preset.fusionEfficiency)
      setPropulsiveEfficiencyUI(preset.propulsiveEfficiency)
    }
  }

  return (
    <div className="space-y-6">
      {/* Ship Presets */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Ship className="w-5 h-5 text-cyan-400" />
          <h4 className="font-semibold text-white">Ship Presets</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            max={50000}
            step={500}
            unit=" tons"
            helperText="Ship structure without fuel"
            logarithmic={true}
          />

          <ParameterSlider
            label="Wet Mass (full tanks)"
            value={wetMassUI}
            onChange={setWetMassUI}
            min={dryMassUI + 500}
            max={1000000}
            step={1000}
            unit=" tons"
            helperText="Ship mass with full fuel load"
            logarithmic={true}
          />

          <ParameterSlider
            label="Acceleration"
            value={accelerationUI}
            onChange={setAccelerationUI}
            min={0.1}
            max={1.0}
            step={0.05}
            unit="g"
            helperText="Constant acceleration (0.3g typical for Epstein drive)"
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
            label="Fusion Efficiency (mass→energy)"
            value={fusionEfficiencyUI}
            onChange={setFusionEfficiencyUI}
            min={0.1}
            max={1.0}
            step={0.05}
            unit="%"
            helperText="D-T fusion: ~0.4% | D-He³: ~0.7%"
          />

          <ParameterSlider
            label="Propulsive Efficiency (energy→thrust)"
            value={propulsiveEfficiencyUI}
            onChange={setPropulsiveEfficiencyUI}
            min={10}
            max={100}
            step={5}
            unit="%"
            helperText="Losses: radiation, neutrons, nozzle efficiency..."
          />

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-500 mt-4">
            <p className="text-xs text-slate-200">
              <span className="font-semibold text-slate-100">Note:</span> Higher efficiencies
              result in greater exhaust velocity and longer range, but may be physically
              impractical. The Epstein Drive from The Expanse uses highly efficient fusion.
            </p>
          </div>
        </div>
      </CollapsiblePanel>
      </div>
    </div>
  )
}
