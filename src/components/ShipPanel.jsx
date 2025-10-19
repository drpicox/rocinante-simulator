// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/ShipPanel.jsx
import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMass, setFuel, setEfficiency, setAcceleration, setShowRange } from '../features/ship/shipSlice'
import { calculateMaxRange, formatRange } from '../utils/range'
import {
  Rocket,
  Droplet,
  Zap,
  Atom,
  Sparkles,
  Star,
  Flame,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ship,
  CircleDot,
  Eye,
  EyeOff
} from 'lucide-react'

// Engine presets: efficiency is in percent (%), acceleration in g's
const ENGINE_PRESETS = [
  { key: 'ch4-o2-chem', name: 'CH₄/O₂ (Methane, Raptor)', efficiency: 0.00000010, acceleration: 1.2, icon: Droplet, category: 'chemical' },
  { key: 'h2-o2-chem', name: 'H₂/O₂ Chemical', efficiency: 0.00000012, acceleration: 1.5, icon: Droplet, category: 'chemical' },
  { key: 'h2o2-chem', name: 'H₂O₂ Chemical', efficiency: 0.00000005, acceleration: 1, icon: Droplet, category: 'chemical' },
  { key: 'solar-ion', name: 'Solar Ion', efficiency: 0.0001, acceleration: 0.00002, icon: Zap, category: 'electric' },
  { key: 'orion', name: 'Orion (Fission Bombs)', efficiency: 0.0005, acceleration: 1.5, icon: Flame, category: 'nuclear' },
  { key: 'nuclear-ion', name: 'Nuclear Ion', efficiency: 0.0008, acceleration: 0.00002, icon: Zap, category: 'electric' },
  { key: 'vasimr', name: 'Plasma (VASIMR)', efficiency: 0.0008, acceleration: 0.0001, icon: Zap, category: 'electric' },
  { key: 'ntr', name: 'Nuclear Thermal (NTR)', efficiency: 0.02, acceleration: 0.3, icon: Atom, category: 'nuclear' },
  { key: 'dt-fusion', name: 'D-T Fusion', efficiency: 0.1, acceleration: 0.1, icon: Atom, category: 'fusion' },
  { key: 'dt-fusion-perfect', name: 'D-T Fusion (Perfect)', efficiency: 0.4, acceleration: 0.1, icon: Sparkles, category: 'fusion' },
  { key: 'dhe3', name: 'D-He³ Fusion', efficiency: 0.2, acceleration: 0.2, icon: Atom, category: 'fusion' },
  { key: 'dhe3-perfect', name: 'D-He³ Fusion (Perfect)', efficiency: 0.7, acceleration: 0.2, icon: Sparkles, category: 'fusion' },
  { key: 'epstein', name: 'Epstein Fusion Drive', efficiency: 0.7, acceleration: 0.3, icon: Rocket, category: 'fusion' },
  { key: 'antimatter', name: 'Antimatter', efficiency: 20, acceleration: 1, icon: Star, category: 'exotic' },
  { key: 'antimatter-perfect', name: 'Antimatter (Perfect)', efficiency: 100, acceleration: 1, icon: Sparkles, category: 'exotic' },
]

// Ship presets: when selected, set mass, fuel, and engine preset
const SHIP_PRESETS = [
  {
    key: 'rocinante',
    name: 'Rocinante',
    icon: Rocket,
    mass: 5000, // tons
    fuel: 25000,  // tons
    engineKey: 'epstein'
  },
  {
    key: 'canterbury',
    name: 'Canterbury',
    icon: Ship,
    mass: 1500000, // tons (bulk ice hauler)
    fuel: 200000,  // tons
    engineKey: 'ntr'
  }
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
  const { mass, fuel, efficiency, acceleration, showRange } = useSelector((state) => state.ship)
  const [isExpanded, setIsExpanded] = useState(true)

  const headerGradient = 'linear-gradient(135deg, #34d399, #06b6d4)'

  const selectedPresetKey = findPresetKey(Number(efficiency), Number(acceleration))
  const selectedPreset = ENGINE_PRESETS.find(p => p.key === selectedPresetKey)
  const SelectedIcon = selectedPreset?.icon || Settings

  const applyPreset = (key) => {
    const preset = ENGINE_PRESETS.find(p => p.key === key)
    if (!preset) return
    // Dispatch both updates; reducers will clamp to valid ranges if needed
    dispatch(setEfficiency(preset.efficiency))
    dispatch(setAcceleration(preset.acceleration))
  }

  // Determine selected ship preset based on mass, fuel, and engine preset match
  const selectedShipKey = (() => {
    for (const s of SHIP_PRESETS) {
      if (mass === s.mass && fuel === s.fuel && selectedPresetKey === s.engineKey) return s.key
    }
    return 'custom'
  })()
  const selectedShip = SHIP_PRESETS.find(s => s.key === selectedShipKey)
  const SelectedShipIcon = selectedShip?.icon || Settings

  const applyShipPreset = (key) => {
    const ship = SHIP_PRESETS.find(s => s.key === key)
    if (!ship) return
    dispatch(setMass(ship.mass))
    dispatch(setFuel(ship.fuel))
    applyPreset(ship.engineKey)
  }

  // Cycle through presets with wrap-around
  const cyclePreset = (delta) => {
    const keys = ENGINE_PRESETS.map(p => p.key)
    let idx = keys.indexOf(selectedPresetKey)
    // If custom, go to first on next, last on prev
    if (idx === -1) idx = delta > 0 ? -1 : 0
    idx = (idx + delta + keys.length) % keys.length
    applyPreset(keys[idx])
  }

  const cycleShipPreset = (delta) => {
    const keys = SHIP_PRESETS.map(s => s.key)
    let idx = keys.indexOf(selectedShipKey)
    if (idx === -1) idx = delta > 0 ? -1 : 0
    idx = (idx + delta + keys.length) % keys.length
    applyShipPreset(keys[idx])
  }

  // Calculate max range based on current ship parameters
  const maxRangeMeters = useMemo(() => {
    return calculateMaxRange(mass, fuel, efficiency, acceleration)
  }, [mass, fuel, efficiency, acceleration])

  const formattedRange = useMemo(() => {
    return formatRange(maxRangeMeters)
  }, [maxRangeMeters])

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
          }}>{selectedShip?.name ? `${selectedShip?.name}` : 'Ship Configuration'}</h3>
        </div>
      </button>

      <div style={{
        maxHeight: isExpanded ? '600px' : 0,
        opacity: isExpanded ? 1 : 0,
        overflow: isExpanded ? 'auto' : 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        paddingRight: isExpanded ? '4px' : 0
      }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          {/* Ship preset selector */}
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{
              fontSize: 12,
              color: '#99f6e4',
              letterSpacing: 0.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <SelectedShipIcon size={14} strokeWidth={2.5} />
              Ship
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
              {/* Selector container */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.12))',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                boxShadow: '0 2px 12px rgba(45, 212, 191, 0.15)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                flex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(16, 185, 129, 0.18))'
                e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.12))'
                e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.4)'
              }}
              >
                <SelectedShipIcon
                  size={16}
                  strokeWidth={2}
                  style={{
                    color: selectedShipKey === 'custom' ? 'rgba(255,255,255,0.5)' : '#5eead4',
                    flexShrink: 0
                  }}
                />
                <select
                  value={selectedShipKey}
                  onChange={(e) => applyShipPreset(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: selectedShipKey === 'custom' ? 'rgba(255,255,255,0.7)' : '#5eead4',
                    outline: 'none',
                    fontSize: 13,
                    fontWeight: selectedShipKey === 'custom' ? 400 : 600,
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    paddingRight: 0
                  }}
                  aria-label="Ship preset selector"
                >
                  <option value="custom" style={{
                    background: '#1a1a2e',
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic'
                  }}>
                    Custom Ship
                  </option>
                  <optgroup label="━━━ Known Ships ━━━" style={{ background: '#1a1a2e', color: '#5eead4' }}>
                    <option value="rocinante" style={{ background: '#1a1a2e', color: '#34d399', fontWeight: 600 }}>
                      Rocinante
                    </option>
                    <option value="canterbury" style={{ background: '#1a1a2e', color: 'white' }}>
                      Canterbury
                    </option>
                  </optgroup>
                </select>

                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  style={{
                    color: '#5eead4',
                    flexShrink: 0
                  }}
                />
              </div>

              {/* Split button - Up/Down */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                flexShrink: 0
              }}>
                {/* Up button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); cycleShipPreset(-1) }}
                  disabled={selectedShipKey === SHIP_PRESETS[0].key}
                  title="Previous ship"
                  aria-label="Previous ship preset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 19,
                    borderRadius: '4px 4px 0 0',
                    background: selectedShipKey === SHIP_PRESETS[0].key
                      ? 'rgba(45, 212, 191, 0.05)'
                      : 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    borderBottom: 'none',
                    color: selectedShipKey === SHIP_PRESETS[0].key
                      ? 'rgba(153, 246, 228, 0.3)'
                      : '#99f6e4',
                    cursor: selectedShipKey === SHIP_PRESETS[0].key ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0,
                    opacity: selectedShipKey === SHIP_PRESETS[0].key ? 0.4 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedShipKey !== SHIP_PRESETS[0].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.3)'
                      e.currentTarget.style.color = '#5eead4'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedShipKey !== SHIP_PRESETS[0].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.15)'
                      e.currentTarget.style.color = '#99f6e4'
                    }
                  }}
                >
                  <ChevronLeft size={12} strokeWidth={2.5} style={{ pointerEvents: 'none', transform: 'rotate(90deg)' }} />
                </button>

                {/* Down button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); cycleShipPreset(1) }}
                  disabled={selectedShipKey === SHIP_PRESETS[SHIP_PRESETS.length - 1].key}
                  title="Next ship"
                  aria-label="Next ship preset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 19,
                    borderRadius: '0 0 4px 4px',
                    background: selectedShipKey === SHIP_PRESETS[SHIP_PRESETS.length - 1].key
                      ? 'rgba(45, 212, 191, 0.05)'
                      : 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    borderTop: 'none',
                    color: selectedShipKey === SHIP_PRESETS[SHIP_PRESETS.length - 1].key
                      ? 'rgba(153, 246, 228, 0.3)'
                      : '#99f6e4',
                    cursor: selectedShipKey === SHIP_PRESETS[SHIP_PRESETS.length - 1].key ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0,
                    opacity: selectedShipKey === SHIP_PRESETS[SHIP_PRESETS.length - 1].key ? 0.4 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedShipKey !== SHIP_PRESETS[SHIP_PRESETS.length - 1].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.3)'
                      e.currentTarget.style.color = '#5eead4'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedShipKey !== SHIP_PRESETS[SHIP_PRESETS.length - 1].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.15)'
                      e.currentTarget.style.color = '#99f6e4'
                    }
                  }}
                >
                  <ChevronRight size={12} strokeWidth={2.5} style={{ pointerEvents: 'none', transform: 'rotate(90deg)' }} />
                </button>
              </div>
            </div>
            {selectedShipKey !== 'custom' && (
              <div style={{
                padding: '6px 10px',
                background: 'rgba(94, 234, 212, 0.1)',
                borderRadius: 6,
                border: '1px solid rgba(94, 234, 212, 0.25)',
                fontSize: 10,
                color: '#99f6e4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={10} style={{ color: '#5eead4' }} />
                  <span>
                    <strong style={{ color: '#5eead4' }}>Mass:</strong> {selectedShip?.mass.toLocaleString()} t
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Droplet size={10} style={{ color: '#5eead4' }} />
                  <span>
                    <strong style={{ color: '#5eead4' }}>Fuel:</strong> {selectedShip?.fuel.toLocaleString()} t
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Rocket size={10} style={{ color: '#5eead4' }} />
                  <span>
                    <strong style={{ color: '#5eead4' }}>Engine:</strong> {ENGINE_PRESETS.find(p => p.key === selectedShip?.engineKey)?.name}
                  </span>
                </div>
              </div>
            )}
            {selectedShipKey === 'custom' && (
              <div style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 0'
              }}>
                <Settings size={10} style={{ color: 'rgba(255,255,255,0.5)' }} />
                Adjust fields below or pick a ship preset
              </div>
            )}
          </label>

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
            <span style={{
              fontSize: 12,
              color: '#99f6e4',
              letterSpacing: 0.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <Rocket size={14} strokeWidth={2.5} />
              Engine Type
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
              {/* Selector container */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.12))',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                boxShadow: '0 2px 12px rgba(45, 212, 191, 0.15)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                flex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(16, 185, 129, 0.18))'
                e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.12))'
                e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.4)'
              }}
              >
                <SelectedIcon
                  size={16}
                  strokeWidth={2}
                  style={{
                    color: selectedPresetKey === 'custom' ? 'rgba(255,255,255,0.5)' : '#5eead4',
                    flexShrink: 0
                  }}
                />
                <select
                  value={selectedPresetKey}
                  onChange={(e) => applyPreset(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: selectedPresetKey === 'custom' ? 'rgba(255,255,255,0.7)' : '#5eead4',
                    outline: 'none',
                    fontSize: 13,
                    fontWeight: selectedPresetKey === 'custom' ? 400 : 600,
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    paddingRight: 0
                  }}
                  aria-label="Engine preset selector"
                >
                  <option value="custom" style={{
                    background: '#1a1a2e',
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic'
                  }}>
                    Custom Configuration
                  </option>
                  <optgroup label="━━━ Chemical Propulsion ━━━" style={{ background: '#1a1a2e', color: '#5eead4' }}>
                    <option value="ch4-o2-chem" style={{ background: '#1a1a2e', color: 'white' }}>
                      CH₄/O₂ (Methane, Raptor)
                    </option>
                    <option value="h2-o2-chem" style={{ background: '#1a1a2e', color: 'white' }}>
                      H₂/O₂ Chemical
                    </option>
                    <option value="h2o2-chem" style={{ background: '#1a1a2e', color: 'white' }}>
                      H₂O₂ Chemical
                    </option>
                  </optgroup>
                  <optgroup label="━━━ Electric Propulsion ━━━" style={{ background: '#1a1a2e', color: '#5eead4' }}>
                    <option value="solar-ion" style={{ background: '#1a1a2e', color: 'white' }}>
                      Solar Ion
                    </option>
                    <option value="nuclear-ion" style={{ background: '#1a1a2e', color: 'white' }}>
                      Nuclear Ion
                    </option>
                    <option value="vasimr" style={{ background: '#1a1a2e', color: 'white' }}>
                      Plasma (VASIMR)
                    </option>
                  </optgroup>
                  <optgroup label="━━━ Nuclear Propulsion ━━━" style={{ background: '#1a1a2e', color: '#5eead4' }}>
                    <option value="orion" style={{ background: '#1a1a2e', color: 'white' }}>
                      Orion (Fission Bombs)
                    </option>
                    <option value="ntr" style={{ background: '#1a1a2e', color: 'white' }}>
                      Nuclear Thermal (NTR)
                    </option>
                  </optgroup>
                  <optgroup label="━━━ Fusion Drives ━━━" style={{ background: '#1a1a2e', color: '#5eead4' }}>
                    <option value="dt-fusion" style={{ background: '#1a1a2e', color: 'white' }}>
                      D-T Fusion
                    </option>
                    <option value="dt-fusion-perfect" style={{ background: '#1a1a2e', color: 'white' }}>
                      D-T Fusion (Perfect)
                    </option>
                    <option value="dhe3" style={{ background: '#1a1a2e', color: 'white' }}>
                      D-He³ Fusion
                    </option>
                    <option value="dhe3-perfect" style={{ background: '#1a1a2e', color: 'white' }}>
                      D-He³ Fusion (Perfect)
                    </option>
                    <option value="epstein" style={{ background: '#1a1a2e', color: '#34d399', fontWeight: 600 }}>
                      Epstein Fusion Drive
                    </option>
                  </optgroup>
                  <optgroup label="━━━ Exotic Propulsion ━━━" style={{ background: '#1a1a2e', color: '#5eead4' }}>
                    <option value="antimatter" style={{ background: '#1a1a2e', color: '#fbbf24', fontWeight: 600 }}>
                      Antimatter
                    </option>
                    <option value="antimatter-perfect" style={{ background: '#1a1a2e', color: '#f59e0b', fontWeight: 600 }}>
                      Antimatter (Perfect)
                    </option>
                  </optgroup>
                </select>

                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  style={{
                    color: '#5eead4',
                    flexShrink: 0
                  }}
                />
              </div>

              {/* Split button - Up/Down */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                flexShrink: 0
              }}>
                {/* Up button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); cyclePreset(-1) }}
                  disabled={selectedPresetKey === ENGINE_PRESETS[0].key}
                  title="Previous engine"
                  aria-label="Previous engine preset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 19,
                    borderRadius: '4px 4px 0 0',
                    background: selectedPresetKey === ENGINE_PRESETS[0].key
                      ? 'rgba(45, 212, 191, 0.05)'
                      : 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    borderBottom: 'none',
                    color: selectedPresetKey === ENGINE_PRESETS[0].key
                      ? 'rgba(153, 246, 228, 0.3)'
                      : '#99f6e4',
                    cursor: selectedPresetKey === ENGINE_PRESETS[0].key ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0,
                    opacity: selectedPresetKey === ENGINE_PRESETS[0].key ? 0.4 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPresetKey !== ENGINE_PRESETS[0].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.3)'
                      e.currentTarget.style.color = '#5eead4'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPresetKey !== ENGINE_PRESETS[0].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.15)'
                      e.currentTarget.style.color = '#99f6e4'
                    }
                  }}
                >
                  <ChevronLeft size={12} strokeWidth={2.5} style={{ pointerEvents: 'none', transform: 'rotate(90deg)' }} />
                </button>

                {/* Down button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); cyclePreset(1) }}
                  disabled={selectedPresetKey === ENGINE_PRESETS[ENGINE_PRESETS.length - 1].key}
                  title="Next engine"
                  aria-label="Next engine preset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 19,
                    borderRadius: '0 0 4px 4px',
                    background: selectedPresetKey === ENGINE_PRESETS[ENGINE_PRESETS.length - 1].key
                      ? 'rgba(45, 212, 191, 0.05)'
                      : 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    borderTop: 'none',
                    color: selectedPresetKey === ENGINE_PRESETS[ENGINE_PRESETS.length - 1].key
                      ? 'rgba(153, 246, 228, 0.3)'
                      : '#99f6e4',
                    cursor: selectedPresetKey === ENGINE_PRESETS[ENGINE_PRESETS.length - 1].key ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    padding: 0,
                    opacity: selectedPresetKey === ENGINE_PRESETS[ENGINE_PRESETS.length - 1].key ? 0.4 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPresetKey !== ENGINE_PRESETS[ENGINE_PRESETS.length - 1].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.3)'
                      e.currentTarget.style.color = '#5eead4'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPresetKey !== ENGINE_PRESETS[ENGINE_PRESETS.length - 1].key) {
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.15)'
                      e.currentTarget.style.color = '#99f6e4'
                    }
                  }}
                >
                  <ChevronRight size={12} strokeWidth={2.5} style={{ pointerEvents: 'none', transform: 'rotate(90deg)' }} />
                </button>
              </div>
            </div>
            {selectedPresetKey !== 'custom' && (
              <div style={{
                padding: '6px 10px',
                background: 'rgba(94, 234, 212, 0.1)',
                borderRadius: 6,
                border: '1px solid rgba(94, 234, 212, 0.25)',
                fontSize: 10,
                color: '#99f6e4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={10} style={{ color: '#5eead4' }} />
                  <span>
                    <strong style={{ color: '#5eead4' }}>η:</strong> {selectedPreset?.efficiency}%
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Rocket size={10} style={{ color: '#5eead4' }} />
                  <span>
                    <strong style={{ color: '#5eead4' }}>a:</strong> {selectedPreset?.acceleration}g
                  </span>
                </div>
              </div>
            )}
            {selectedPresetKey === 'custom' && (
              <div style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 0'
              }}>
                <Settings size={10} style={{ color: 'rgba(255,255,255,0.5)' }} />
                Adjust sliders below to configure your custom engine
              </div>
            )}
          </label>

          <Field
            label="Mass-Energy Efficiency"
            unit="%"
            value={efficiency}
            min={0.00000005}
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

          {/* Maximum Range Display with visibility toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '10px 12px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.12))',
            border: '1px solid rgba(45, 212, 191, 0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <CircleDot size={16} strokeWidth={2.5} style={{ color: '#5eead4', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontSize: 10,
                  color: '#99f6e4',
                  letterSpacing: 0.5,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}>
                  Max Range
                </span>
                <span style={{
                  fontSize: 16,
                  color: '#5eead4',
                  fontWeight: 700,
                  letterSpacing: 0.3,
                }}>
                  {formattedRange}
                </span>
              </div>
            </div>
            <button
              onClick={() => dispatch(setShowRange(!showRange))}
              title={showRange ? "Hide range sphere" : "Show range sphere"}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 6,
                background: showRange ? 'rgba(45, 212, 191, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                border: showRange ? '2px solid rgba(45, 212, 191, 0.6)' : '2px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = showRange ? 'rgba(45, 212, 191, 0.35)' : 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.borderColor = showRange ? 'rgba(45, 212, 191, 0.8)' : 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = showRange ? 'rgba(45, 212, 191, 0.25)' : 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.borderColor = showRange ? 'rgba(45, 212, 191, 0.6)' : 'rgba(255, 255, 255, 0.2)'
              }}
              aria-label={showRange ? "Hide range sphere" : "Show range sphere"}
            >
              {showRange ? (
                <Eye size={18} strokeWidth={2.5} style={{ color: '#34d399' }} />
              ) : (
                <EyeOff size={18} strokeWidth={2.5} style={{ color: '#ffffff', opacity: 0.7 }} />
              )}
            </button>
          </div>
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
