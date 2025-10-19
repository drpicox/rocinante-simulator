// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/ShipPanel.jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMass, setFuel, setEfficiency, setAcceleration, resetShip } from '../features/ship/shipSlice'

// Engine presets: efficiency is in percent (%), acceleration in g's
const ENGINE_PRESETS = [
  { key: 'h2o2-chem', name: 'H2O2 Chemical', efficiency: 0.00000008, acceleration: 1 },
  { key: 'h2-o2-chem', name: 'H2/O2 Chemical', efficiency: 0.00000008, acceleration: 1.5 },
  { key: 'solar-ion', name: 'Solar Ion', efficiency: 0.0001, acceleration: 0.00002 },
  { key: 'orion', name: 'Orion (Fission Bombs)', efficiency: 0.0005, acceleration: 1.5 },
  { key: 'nuclear-ion', name: 'Nuclear Ion', efficiency: 0.0008, acceleration: 0.00002 },
  { key: 'vasimr', name: 'Plasma (VASIMR)', efficiency: 0.0008, acceleration: 0.0001 },
  { key: 'ntr', name: 'Nuclear Thermal (NTR)', efficiency: 0.02, acceleration: 0.3 },
  { key: 'dt-fusion', name: 'D-T Fusion', efficiency: 0.1, acceleration: 0.1 },
  { key: 'dt-fusion-perfect', name: 'D-T Fusion (Perfect)', efficiency: 0.4, acceleration: 0.1 },
  { key: 'dhe3', name: 'D-He3 Fusion', efficiency: 0.2, acceleration: 0.2 },
  { key: 'dhe3-perfect', name: 'D-He3 Fusion (Perfect)', efficiency: 0.7, acceleration: 0.2 },
  { key: 'epstein', name: 'Epstein Fusion Drive', efficiency: 0.3, acceleration: 0.3 },
  { key: 'antimatter', name: 'Antimatter', efficiency: 20, acceleration: 1 },
  { key: 'antimatter-perfect', name: 'Antimatter (Perfect)', efficiency: 100, acceleration: 1 },
]

const findPresetKey = (eff, acc) => {
  // Try exact match first
  for (const p of ENGINE_PRESETS) {
    if (p.efficiency === eff && p.acceleration === acc) return p.key
  }
  // Then tolerance match (accounts for rounding/clamping)
  const approxEqual = (a, b) => {
    const diff = Math.abs(a - b)
    const denom = Math.max(1e-12, Math.abs(b))
    return diff <= 1e-12 || diff / denom <= 1e-6
  }
  for (const p of ENGINE_PRESETS) {
    if (approxEqual(p.efficiency, eff) && approxEqual(p.acceleration, acc)) return p.key
  }
  return 'custom'
}

export default function ShipPanel() {
  const dispatch = useDispatch()
  const { mass, fuel, efficiency, acceleration } = useSelector((state) => state.ship)
  const [isExpanded, setIsExpanded] = useState(true)

  const headerGradient = 'linear-gradient(135deg, #34d399, #06b6d4)'

  const selectedPresetKey = findPresetKey(Number(efficiency), Number(acceleration))

  const applyPreset = (key) => {
    const preset = ENGINE_PRESETS.find(p => p.key === key)
    if (!preset) return
    // Dispatch both updates; reducers will clamp to valid ranges if needed
    dispatch(setEfficiency(preset.efficiency))
    dispatch(setAcceleration(preset.acceleration))
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      background: isExpanded
        ? 'linear-gradient(135deg, rgba(8, 28, 36, 0.95), rgba(9, 50, 44, 0.92))'
        : 'linear-gradient(135deg, rgba(8, 28, 36, 0.85), rgba(9, 50, 44, 0.82))',
      color: 'white',
      padding: isExpanded ? '20px' : '12px 16px',
      borderRadius: '12px',
      maxWidth: isExpanded ? '380px' : '280px',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(45, 212, 191, 0.35)',
      boxShadow: isExpanded
        ? '0 8px 32px rgba(45, 212, 191, 0.22), 0 0 0 1px rgba(45, 212, 191, 0.1) inset'
        : '0 4px 16px rgba(45, 212, 191, 0.18)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      minWidth: '280px'
    }}>
      <button
        onClick={() => setIsExpanded((v) => !v)}
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
          marginBottom: isExpanded ? '12px' : 0
        }}
        aria-label={isExpanded ? 'Collapse ship panel' : 'Expand ship panel'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '20px',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            display: 'inline-block',
            color: '#5eead4'
          }}>▼</span>
          <h3 style={{
            margin: 0,
            fontSize: isExpanded ? '18px' : '16px',
            fontWeight: 600,
            background: headerGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'font-size 0.3s ease'
          }}>Ship Configuration</h3>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); dispatch(resetShip()) }}
          style={{
            background: 'rgba(45, 212, 191, 0.18)',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            borderRadius: '6px',
            color: '#99f6e4',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '6px 10px',
            transition: 'all 0.2s ease',
            fontWeight: 600
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 212, 191, 0.3)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(45, 212, 191, 0.18)' }}
          aria-label="Reset ship configuration"
        >Reset</button>
      </button>

      <div style={{
        maxHeight: isExpanded ? '600px' : 0,
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <Field
            label="Mass"
            unit="tons"
            value={mass}
            min={1}
            max={1000000000}
            step={1}
            onChange={(v) => dispatch(setMass(v))}
            accent="rgba(45, 212, 191, 0.5)"
            discrete
          />
          <Field
            label="Fuel"
            unit="tons"
            value={fuel}
            min={1}
            max={1000000000}
            step={1}
            onChange={(v) => dispatch(setFuel(v))}
            accent="rgba(45, 212, 191, 0.5)"
            discrete
          />

          {/* Engine preset selector */}
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#99f6e4', letterSpacing: 0.3 }}>Engine Preset</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 8,
              borderRadius: 8,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(45, 212, 191, 0.28)'
            }}>
              <select
                value={selectedPresetKey}
                onChange={(e) => applyPreset(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  outline: 'none',
                  fontSize: 14,
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
                aria-label="Engine preset selector"
              >
                <option value="custom" style={{ color: 'black' }}>Custom</option>
                {ENGINE_PRESETS.map(p => (
                  <option key={p.key} value={p.key} style={{ color: 'black' }}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
              Selecting a preset updates Mass-Energy Efficiency (%) and Acceleration (gs).
            </span>
          </label>

          <Field
            label="Mass-Energy Efficiency"
            unit="%"
            value={efficiency}
            min={0.00000008}
            max={100}
            step="any"
            onChange={(v) => dispatch(setEfficiency(v))}
            accent="rgba(16, 185, 129, 0.55)"
            discrete
          />
          <Field
            label="Acceleration"
            unit="gs"
            value={acceleration}
            min={0.000001}
            max={10}
            step="any"
            onChange={(v) => dispatch(setAcceleration(v))}
            accent="rgba(59, 130, 246, 0.5)"
            discrete
          />
        </div>

        <div style={{
          marginTop: '14px',
          padding: '10px 12px',
          background: 'rgba(45, 212, 191, 0.08)',
          borderRadius: '8px',
          border: '1px solid rgba(45, 212, 191, 0.15)'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
            Tip: Efficiency is the % of fuel mass converted into thrust energy (E = m c^2). 100% ⇒ all fuel mass becomes thrust energy; 50% ⇒ half becomes energy, the rest is discarded.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, unit, value, min, max, step, onChange, accent, discrete = false }) {
  // Helpers for discrete, quasi-logarithmic steps like: 0, 1..9, 10..90, 100..900, ... including sub-1 decades
  const generateLogSteps = (minVal, maxVal, includeZero = false) => {
    const vals = []
    if (includeZero && minVal <= 0) vals.push(0)
    const lo = Math.max(minVal, Number.MIN_VALUE)
    const hi = Math.max(lo, maxVal)
    const minExp = Math.floor(Math.log10(lo))
    const maxExp = Math.floor(Math.log10(hi))
    for (let k = minExp; k <= maxExp; k++) {
      const base = Math.pow(10, k)
      for (let n = 1; n <= 9; n++) {
        const v = n * base
        if (v >= minVal && v <= maxVal) vals.push(+v.toPrecision(12))
      }
    }
    return Array.from(new Set(vals)).sort((a, b) => a - b)
  }

  const nearestIndex = (arr, v) => {
    if (!arr || arr.length === 0) return 0
    let idx = 0
    let best = Infinity
    for (let i = 0; i < arr.length; i++) {
      const d = Math.abs(arr[i] - v)
      if (d < best) { best = d; idx = i }
    }
    return idx
  }

  const allowedValues = discrete ? generateLogSteps(min, max, min <= 0) : null
  const sliderIndex = discrete ? nearestIndex(allowedValues, Number(value)) : null

  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{
        fontSize: 12,
        color: '#99f6e4',
        letterSpacing: 0.3
      }}>{label}</span>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderRadius: 8,
        background: 'rgba(0,0,0,0.25)',
        border: `1px solid ${accent}`
      }}>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'white',
            outline: 'none',
            fontSize: 14
          }}
          aria-label={`${label} (${unit})`}
        />
        <span style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 13,
          borderLeft: '1px solid rgba(255,255,255,0.12)',
          paddingLeft: 8,
          minWidth: 28,
          textAlign: 'center'
        }}>{unit}</span>
      </div>

      {discrete ? (
        <input
          type="range"
          value={sliderIndex}
          min={0}
          max={allowedValues.length - 1}
          step={1}
          onChange={(e) => onChange(allowedValues[Number(e.target.value)])}
          style={{
            width: '100%',
            accentColor: '#34d399',
            filter: 'drop-shadow(0 0 6px rgba(45, 212, 191, 0.25))'
          }}
          aria-label={`${label} slider (discrete)`}
        />
      ) : (
        <input
          type="range"
          value={Number(value)}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            accentColor: '#34d399',
            filter: 'drop-shadow(0 0 6px rgba(45, 212, 191, 0.25))'
          }}
          aria-label={`${label} slider`}
        />
      )}
    </label>
  )
}
