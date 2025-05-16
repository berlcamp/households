// /lib/redux/listSlice.ts
import { Household, Resident } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ListState {
  households: Household[]
  residents: Resident[]
  householdsPage: number
  residentsPage: number
}

const initialState: ListState = {
  households: [],
  residents: [],
  householdsPage: 1,
  residentsPage: 1
}

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setHouseholds: (state, action: PayloadAction<Household[]>) => {
      state.households = action.payload
    },
    appendHouseholds: (state, action: PayloadAction<Household[]>) => {
      state.households = [...state.households, ...action.payload]
      state.householdsPage += 1
    },
    resetHouseholds: (state) => {
      state.households = []
      state.householdsPage = 1
    },
    setHouseholdsPage: (state, action) => {
      state.householdsPage = action.payload
    },
    setResidents: (state, action: PayloadAction<Resident[]>) => {
      state.residents = action.payload
    },
    appendResidents: (state, action: PayloadAction<Resident[]>) => {
      state.residents = [...state.residents, ...action.payload]
      state.residentsPage += 1
    },
    resetResidents: (state) => {
      state.residents = []
      state.residentsPage = 1
    }
  }
})

export const {
  setHouseholds,
  appendHouseholds,
  resetHouseholds,
  setResidents,
  appendResidents,
  resetResidents
} = listSlice.actions

export default listSlice.reducer
