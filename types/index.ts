import { RootState as RootStateType } from '@/lib/redux'

export type RootState = RootStateType

export interface Settings {
  id: string
  shipping_company: string
  shipping_address: string
  shipping_contact_number: string
  billing_company: string
  billing_address: string
  billing_contact_number: string
}

export interface User {
  id: string
  user_id: string
  owner_id: string
  name: string
  password: string
  email?: string
  type?: string
  is_active: boolean
  created_at?: string
}

export interface AddUserFormValues {
  name: string
  email: string
  type: string
  is_active: boolean
}

export interface Resident {
  id: number
  fullname: string
  barangay_id: number
  barangay?: Barangay
}

export interface Barangay {
  id: number
  name: string
  description: string
  owner_id: string
  color: string
}

export interface HouseholdMember {
  id: number
  resident_id: number
  barangay_id: number
  resident: Resident
  barangay?: Barangay
  type: 'leader' | 'member'
}

export interface Household {
  id: number
  barangay_id: number
  barangay: Barangay
  members: HouseholdMember[]
}
