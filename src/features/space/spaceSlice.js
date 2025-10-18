import { createSlice } from '@reduxjs/toolkit'

export const spaceSlice = createSlice({
  name: 'space',
  initialState: {
    selected: null,
  },
  reducers: {
    select: (state, action) => {
      state.selected = action.payload
    },
    deselect: (state) => {
      state.selected = null
    },
  },
})

export const { select, deselect } = spaceSlice.actions

export default spaceSlice.reducer
