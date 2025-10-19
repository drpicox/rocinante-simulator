// filepath: /Volumes/Projects/claude/rocinante-simulator/src/features/ship/shipSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mass: 25000, // tons
  fuel: 5000, // tons
  efficiency: 72, // percent
  acceleration: 0.3, // g's
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const shipSlice = createSlice({
  name: 'ship',
  initialState,
  reducers: {
    setMass(state, action) {
      const v = Number(action.payload)
      state.mass = isNaN(v) ? state.mass : clamp(v, 1, 1_000_000_000)
    },
    setFuel(state, action) {
      const v = Number(action.payload)
      state.fuel = isNaN(v) ? state.fuel : clamp(v, 1, 1_000_000_000)
    },
    setEfficiency(state, action) {
      const v = Number(action.payload)
      state.efficiency = isNaN(v) ? state.efficiency : clamp(v, 0.00000008, 100)
    },
    setAcceleration(state, action) {
      const v = Number(action.payload)
      state.acceleration = isNaN(v) ? state.acceleration : clamp(v, 1e-6, 10)
    },
    resetShip() {
      return initialState
    }
  }
})

export const { setMass, setFuel, setEfficiency, setAcceleration, resetShip } = shipSlice.actions
export default shipSlice.reducer
