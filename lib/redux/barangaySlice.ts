// lib/redux/barangaySlice.ts
import { Barangay } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BarangayState {
  selectedBarangay: Barangay | null
}

const initialState: BarangayState = {
  selectedBarangay: null
}

const barangaySlice = createSlice({
  name: 'barangay',
  initialState,
  reducers: {
    setBarangay(state, action: PayloadAction<Barangay>) {
      state.selectedBarangay = action.payload
    },
    clearBarangay(state) {
      state.selectedBarangay = null
    }
  }
})

export const { setBarangay, clearBarangay } = barangaySlice.actions
export default barangaySlice.reducer
