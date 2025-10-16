/**
 * Physical Constants
 * All values in SI units unless otherwise specified
 */

// Speed of light (m/s)
export const C = 299792458

// Gravitational acceleration at Earth's surface (m/s²)
export const G = 9.81

// Astronomical Unit - average Earth-Sun distance (meters)
export const AU = 149597870700

// Light year (meters)
export const LIGHT_YEAR = 9.461e15

// Julian Date for J2000.0 epoch (January 1, 2000, 12:00 TT)
export const J2000 = 2451545.0

// Seconds per day
export const SECONDS_PER_DAY = 86400

// Days per year (Julian year)
export const DAYS_PER_YEAR = 365.25

// Conversion factors
export const KM_TO_M = 1000
export const M_TO_KM = 1 / KM_TO_M
export const AU_TO_LY = AU / LIGHT_YEAR
export const LY_TO_AU = LIGHT_YEAR / AU
export const TONS_TO_KG = 1000
export const KG_TO_TONS = 1 / TONS_TO_KG

// Default ship parameters
export const DEFAULT_DRY_MASS_TONS = 1000
export const DEFAULT_WET_MASS_TONS = 3000
export const DEFAULT_ACCELERATION_G = 0.3
export const DEFAULT_FUSION_EFFICIENCY = 0.4  // 0.4% (typical for D-T fusion)
export const DEFAULT_PROPULSIVE_EFFICIENCY = 50  // 50%
export const DEFAULT_ENGINE_TYPE = 'fusion'

// Engine types and their efficiency ranges
export const ENGINE_TYPES = {
  fusion: {
    id: 'fusion',
    name: 'Fusion (Epstein Drive)',
    description: 'Deuterium-Tritium or D-He³ fusion reactions',
    massEnergyEfficiency: {
      min: 0.1,
      max: 1.0,
      step: 0.05,
      default: 0.4,
      unit: '%'
    },
    propulsiveEfficiency: {
      min: 10,
      max: 100,
      step: 5,
      default: 50,
      unit: '%'
    },
    helperText: 'D-T fusion: ~0.4% | D-He³: ~0.7% | Theoretical max: ~1%'
  },
  antimatter: {
    id: 'antimatter',
    name: 'Matter-Antimatter',
    description: 'Matter-antimatter annihilation (E=mc²)',
    massEnergyEfficiency: {
      min: 1,
      max: 100,
      step: 1,
      default: 50,
      unit: '%'
    },
    propulsiveEfficiency: {
      min: 10,
      max: 100,
      step: 5,
      default: 90,
      unit: '%'
    },
    helperText: 'Theoretical max: 100% | Practical with containment losses: 50-90%'
  }
}

// Ship presets for different mission profiles
export const SHIP_PRESETS = {
  rocinante: {
    id: 'rocinante',
    name: 'Rocinante (Solar System)',
    description: 'Corvette-class light frigate optimized for inner and mid solar system travel',
    engineType: 'fusion',
    dryMass: 1000,
    wetMass: 3000,
    acceleration: 0.3,
    fusionEfficiency: 0.4,
    propulsiveEfficiency: 50,
    maxRange: '~3.4 AU'
  },
  canterbury: {
    id: 'canterbury',
    name: 'Canterbury (Fusion Stellar)',
    description: 'Massive ice hauler with fusion drives for deep space missions',
    engineType: 'fusion',
    dryMass: 10000,
    wetMass: 1000000000,
    acceleration: 0.1,
    fusionEfficiency: 0.7,
    propulsiveEfficiency: 70,
    maxRange: '~200,000 AU'
  },
  nauvoo: {
    id: 'nauvoo',
    name: 'Nauvoo (Antimatter)',
    description: 'Generation ship with antimatter drives for interstellar colonization',
    engineType: 'antimatter',
    dryMass: 50000,
    wetMass: 10000000,
    acceleration: 0.05,
    fusionEfficiency: 50,
    propulsiveEfficiency: 90,
    maxRange: '~3 light years'
  }
}
