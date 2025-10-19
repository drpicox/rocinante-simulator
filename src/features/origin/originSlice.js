// filepath: /Volumes/Projects/claude/rocinante-simulator/src/features/origin/originSlice.js
import { createSlice } from '@reduxjs/toolkit'

// Origin of coordinates/reference. Default to Earth.
const initialState = {
  name: 'Earth',
  kind: 'planet', // 'planet' | 'moon' | 'star'
}

export const originSlice = createSlice({
  name: 'origin',
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      const { name, kind } = action.payload
      state.name = name
      state.kind = kind
    },
    resetOrigin: () => initialState,
  },
})

export const { setOrigin, resetOrigin } = originSlice.actions

export const selectOrigin = (state) => state.origin

export default originSlice.reducer

