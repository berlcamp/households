import { configureStore } from '@reduxjs/toolkit'
import barangayReducer from './barangaySlice'
import barangaysReducer from './barangaysSlice'
import listReducer from './listSlice'
import stocksReducer from './stocksSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    barangay: barangayReducer,
    list: listReducer,
    barangaysList: barangaysReducer,
    user: userReducer,
    stocksList: stocksReducer
  }
})

// Infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>

// You can also export the `AppDispatch` type
export type AppDispatch = typeof store.dispatch
