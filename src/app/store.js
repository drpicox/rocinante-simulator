import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import spaceReducer from '../features/space/spaceSlice'
import originReducer from '../features/origin/originSlice'
import shipReducer from '../features/ship/shipSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    space: spaceReducer,
    origin: originReducer,
    ship: shipReducer,
  },
})
