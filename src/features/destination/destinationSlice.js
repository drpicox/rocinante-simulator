import { createSlice } from '@reduxjs/toolkit'

export const destinationSlice = createSlice({
  name: 'destination',
  initialState: {
    // Trip destination (star/planet/moon) by name
    destination: null,
  },
  reducers: {
    setDestination: (state, action) => {
      state.destination = action.payload
    },
    clearDestination: (state) => {
      state.destination = null
    },
  },
})

export const { setDestination, clearDestination } = destinationSlice.actions

// Selector for consumers
export const selectDestination = (state) => state.destination.destination

export default destinationSlice.reducer

