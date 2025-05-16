'use client'

import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook'

import { addList } from '@/lib/redux/listSlice'
import { addList as addList2 } from '@/lib/redux/stocksSlice'
import { supabase } from '@/lib/supabase/client'
import { Household, Resident } from '@/types'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import HeaderDropdown from './HeaderDropdownMenu'
import { Input } from './ui/input'
import { SidebarTrigger } from './ui/sidebar'

export default function StickyHeader() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useAppDispatch()
  const barangay = useAppSelector((state) => state.barangay.selectedBarangay)

  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async (searchTerm: string) => {
    // If there's a search term, use the SQL function to filter
    if (searchTerm.trim() !== '') {
      const { data: searchResults, error } = await supabase.rpc(
        'households_search_member',
        {
          query: searchTerm,
          p_barangay: barangay
        }
      )

      if (error) {
        console.error('Search error:', error.message)
        return
      }

      // If search has no results, do not display anything
      if (!searchResults || searchResults.length === 0) {
        dispatch(addList([]))
        dispatch(addList2([]))
        return
      }

      const ids = searchResults.map((r: any) => r.resident_id)

      // Filtered residents
      const { data: residentsData = [] } = await supabase
        .from('residents')
        .select()
        .in('id', ids)

      // Filtered household members
      const { data: householdMembersData = [] } = await supabase
        .from('household_members')
        .select('resident_id')
        .in('resident_id', ids)

      const residentsWithHousehold = residentsData?.map(
        (resident: Resident) => ({
          ...resident,
          hasHousehold: householdMembersData?.some(
            (m) => m.resident_id === resident.id
          )
        })
      )

      // Fetch households only related to found members
      const { data: householdsData } = await supabase
        .from('households')
        .select('*, members:household_members(*, resident:resident_id(*))')
        .eq('barangay', barangay)

      const transformedHouseholds =
        (householdsData as Household[] | null)?.map((h) => ({
          id: h.id,
          members: h.members.map((m) => ({
            id: m.resident_id,
            resident_id: m.resident_id,
            fullname: m.fullname,
            type: m.type
          }))
        })) || []

      dispatch(addList(transformedHouseholds))
      dispatch(addList2(residentsWithHousehold ?? []))
      return
    }

    // If no search, get all residents
    const { data: residentsData = [] } = await supabase
      .from('residents')
      .select()
      .eq('barangay', barangay)

    const { data: householdMembersData = [] } = await supabase
      .from('household_members')
      .select('resident_id')
      .eq('barangay', barangay)

    const residentsWithHousehold = residentsData?.map((resident: Resident) => ({
      ...resident,
      hasHousehold: householdMembersData?.some(
        (m) => m.resident_id === resident.id
      )
    }))

    const { data: householdsData } = await supabase
      .from('households')
      .select('*, members:household_members(*, resident:resident_id(*))')
      .eq('barangay', barangay)

    const transformedHouseholds =
      (householdsData as Household[] | null)?.map((h) => ({
        id: h.id,
        members: h.members.map((m) => ({
          id: m.resident_id,
          resident_id: m.resident_id,
          fullname: m.fullname,
          type: m.type
        }))
      })) || []

    dispatch(addList(transformedHouseholds))
    dispatch(addList2(residentsWithHousehold ?? []))
  }

  return (
    <header className="fixed w-full top-0 z-40 bg-[#2e2e30] border-b border-[#424244] p-2 flex justify-start items-center gap-4">
      <SidebarTrigger />
      {/* Left section: Barangay selector + Search */}
      <div className="flex items-center gap-4">
        <Link href="/create-barangay" className="flex space-x-2 items-center">
          <Button
            variant="ghostdark"
            className="text-white font-semibold flex items-center"
          >
            <span>Create Barangay</span>
            <PlusIcon className="w-4 h-4 text-white" />
          </Button>
        </Link>
      </div>
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isSubmitting) {
            e.preventDefault()
            setIsSubmitting(true)
            fetchData(searchTerm) // optionally call fetch manually
            e.currentTarget.blur() // 👈 Remove focus
            setTimeout(() => setIsSubmitting(false), 1000) // 1 second cooldown
          }
        }}
        className="w-full max-w-sm bg-[#565557] border-none focus-visible:ring-1 focus:ring-white text-white"
      />
      <div className="flex-1"></div>

      {/* Right section: Settings dropdown */}
      <HeaderDropdown />
    </header>
  )
}
