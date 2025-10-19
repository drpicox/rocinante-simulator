import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import destinationReducer from '../features/destination/destinationSlice'
import originReducer from '../features/origin/originSlice'
import shipReducer from '../features/ship/shipSlice'
import travelReducer from '../features/travel/travelSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    destination: destinationReducer,
    origin: originReducer,
    ship: shipReducer,
    travel: travelReducer,
  },
})
