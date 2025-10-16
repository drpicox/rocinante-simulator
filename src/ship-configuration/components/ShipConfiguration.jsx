/**
 * ShipConfiguration Component
 *
 * Collapsible panel for configuring ship parameters
 */

import React from 'react'
import { Rocket, Fuel, Zap } from 'lucide-react'
import { CollapsiblePanel } from '../../ui/components/CollapsiblePanel'

function ParameterSlider({ label, value, onChange, min, max, step, unit, helperText }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        <span className="text-lg font-bold text-blue-400">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
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

  return (
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
            max={2000}
            step={50}
            unit=" tons"
            helperText="Ship structure without fuel"
          />

          <ParameterSlider
            label="Wet Mass (full tanks)"
            value={wetMassUI}
            onChange={setWetMassUI}
            min={dryMassUI + 500}
            max={5000}
            step={100}
            unit=" tons"
            helperText="Ship mass with full fuel load"
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
  )
}
