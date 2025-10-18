import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import spaceReducer from '../features/space/spaceSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    space: spaceReducer,
  },
})
