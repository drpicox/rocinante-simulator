/**
 * useVoyageCalculation Hook
 *
 * Main hook for calculating spacecraft performance metrics
 * Handles debouncing for smooth UI updates
 */

import { useState, useEffect, useMemo } from 'react'
import {
  TONS_TO_KG,
  G,
  AU,
  LIGHT_YEAR
} from '../../constants/physics'
import {
  calculateExhaustVelocity,
  calculateBurnTime,
  calculateInitialMassFlow
} from '../physics/rocket-equation'
import {
  calculateLorentzFactor,
  calculateTimeDilation,
  calculateProperTime,
  velocityFractionOfC
} from '../physics/relativity'
import { calculateAccelerationDistance, calculateVelocity } from '../physics/trajectory'

export function useVoyageCalculation(initialParams) {
  // UI state (updates immediately)
  const [dryMassUI, setDryMassUI] = useState(initialParams.dryMass)
  const [wetMassUI, setWetMassUI] = useState(initialParams.wetMass)
  const [accelerationUI, setAccelerationUI] = useState(initialParams.acceleration)
  const [fusionEfficiencyUI, setFusionEfficiencyUI] = useState(initialParams.fusionEfficiency)
  const [propulsiveEfficiencyUI, setPropulsiveEfficiencyUI] = useState(initialParams.propulsiveEfficiency)
  const [engineTypeUI, setEngineTypeUI] = useState(initialParams.engineType)

  // Debounced calculation state (updates after delay)
  const [dryMass, setDryMass] = useState(initialParams.dryMass)
  const [wetMass, setWetMass] = useState(initialParams.wetMass)
  const [acceleration, setAcceleration] = useState(initialParams.acceleration)
  const [fusionEfficiency, setFusionEfficiency] = useState(initialParams.fusionEfficiency)
  const [propulsiveEfficiency, setPropulsiveEfficiency] = useState(initialParams.propulsiveEfficiency)
  const [engineType, setEngineType] = useState(initialParams.engineType)

  // Debounce effect - update calculation values after 300ms of no changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDryMass(dryMassUI)
      setWetMass(wetMassUI)
      setAcceleration(accelerationUI)
      setFusionEfficiency(fusionEfficiencyUI)
      setPropulsiveEfficiency(propulsiveEfficiencyUI)
      setEngineType(engineTypeUI)
    }, 300)

    return () => clearTimeout(timer)
  }, [dryMassUI, wetMassUI, accelerationUI, fusionEfficiencyUI, propulsiveEfficiencyUI, engineTypeUI])

  // Main calculations
  const results = useMemo(() => {
    const dryMassKg = dryMass * TONS_TO_KG
    const wetMassKg = wetMass * TONS_TO_KG
    const fuelKg = wetMassKg - dryMassKg
    const a = acceleration * G

    // Exhaust velocity
    const vExhaust = calculateExhaustVelocity(fusionEfficiency, propulsiveEfficiency)

    // Total burn time (50% accel, 50% decel)
    const totalTime = calculateBurnTime(dryMass, wetMass, acceleration, vExhaust)
    const accelTime = totalTime / 2

    // Maximum velocity (at midpoint)
    const vMax = calculateVelocity(acceleration, accelTime)
    const vMaxFracC = velocityFractionOfC(vMax)

    // Total distance covered (no coast)
    const distAccel = calculateAccelerationDistance(acceleration, accelTime)
    const totalDist = 2 * distAccel

    // Relativistic effects
    const gamma = calculateLorentzFactor(vMax)
    const timeDilation = calculateTimeDilation(vMax)
    const properTime = calculateProperTime(totalTime, vMax)

    // Mass flow
    const initialMassFlow = calculateInitialMassFlow(wetMassKg, acceleration, vExhaust)

    return {
      // Ship masses
      dryMassKg,
      wetMassKg,
      fuelKg,

      // Engine performance
      vExhaust,
      vExhaustKms: vExhaust / 1000,
      a,
      initialMassFlow,

      // Journey profile
      totalTime,
      totalDays: totalTime / 86400,
      accelTime,
      accelDays: accelTime / 86400,

      // Velocity
      vMax,
      vMaxKms: vMax / 1000,
      vMaxFracC,

      // Distance
      totalDist,
      distAU: totalDist / AU,
      distLightYears: totalDist / LIGHT_YEAR,

      // Relativistic effects
      gamma,
      timeDilation,
      lengthContraction: 1 / gamma,
      properTime,
      properDays: properTime / 86400
    }
  }, [dryMass, wetMass, acceleration, fusionEfficiency, propulsiveEfficiency])

  return {
    // UI state (for immediate slider updates)
    uiState: {
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
    },

    // Calculation parameters (debounced)
    params: {
      dryMass,
      wetMass,
      acceleration,
      fusionEfficiency,
      propulsiveEfficiency,
      engineType
    },

    // Calculation results
    results
  }
}
