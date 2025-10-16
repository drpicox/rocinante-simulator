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

// Ship presets for different mission profiles
export const SHIP_PRESETS = {
  rocinante: {
    id: 'rocinante',
    name: 'Rocinante (Solar System)',
    description: 'Corvette-class light frigate optimized for inner and mid solar system travel',
    dryMass: 1000,
    wetMass: 3000,
    acceleration: 0.3,
    fusionEfficiency: 0.4,
    propulsiveEfficiency: 50,
    maxRange: '~3.4 AU'
  },
  canterbury: {
    id: 'canterbury',
    name: 'Canterbury (Stellar)',
    description: 'Heavy ice hauler with massive fuel capacity for interstellar missions',
    dryMass: 10000,
    wetMass: 500000,
    acceleration: 0.1,
    fusionEfficiency: 0.7,
    propulsiveEfficiency: 70,
    maxRange: '~15,000 AU'
  }
}
