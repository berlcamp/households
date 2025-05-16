/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { HouseholdsTab } from '@/components/HouseholdsTab'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { OverviewTab } from '@/components/OverviewTab'
import { ResidentsTab } from '@/components/ResidentsTab'
import { clearBarangay, setBarangay } from '@/lib/redux/barangaySlice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook'
import { supabase } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'residents' | 'households'
  >('overview')

  const user = useAppSelector((state) => state.user.user)

  const params = useParams()
  const barangayId = params?.barangayid as string

  console.log('params', params)

  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()
  const barangay = useAppSelector((state) => state.barangay.selectedBarangay)

  useEffect(() => {
    if (!barangayId || !user?.owner_id) return

    dispatch(clearBarangay()) // 👈 Clear old barangay when URL changes

    const fetchData = async () => {
      console.log('barangay details fetched')
      setLoading(true)
      // get barangay
      const { data, error } = await supabase
        .from('barangays')
        .select()
        .eq('id', barangayId)
        .eq('owner_id', user?.owner_id)
        .maybeSingle()

      if (error) {
        console.error('Failed to fetch barangay:', error)
      } else if (data) {
        dispatch(setBarangay(data))
      }

      if (data) {
        dispatch(setBarangay(data))
        console.log('barangay details fetched2')
      }
      console.log('barangay details fetched3')
      setLoading(false)
    }
    void fetchData()
  }, [barangayId, user?.owner_id])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!barangay) {
    return (
      <div className="space-y-4 w-full">
        <div className="app__title">
          <h1 className="text-xl font-semibold">Page not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="app__title">
        <h1 className="text-xl font-semibold">{barangay.name}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b flex gap-2 px-4 mt-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-2 text-sm -mb-px cursor-pointer ${
            activeTab === 'overview'
              ? 'border-b-2 font-bold border-gray-500 text-gray-700 dark:text-gray-400'
              : 'text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('households')}
          className={`py-2 px-2 text-sm -mb-px cursor-pointer ${
            activeTab === 'households'
              ? 'border-b-2 font-bold border-gray-500 text-gray-700 dark:text-gray-400'
              : 'text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Households
        </button>
        <button
          onClick={() => setActiveTab('residents')}
          className={`py-2 px-2 text-sm -mb-px cursor-pointer ${
            activeTab === 'residents'
              ? 'border-b-2 font-bold border-gray-500 text-gray-700 dark:text-gray-400'
              : 'text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Residents
        </button>
      </div>

      <div className="px-4">
        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'households' && (
          <HouseholdsTab barangayId={barangay.id} />
        )}
        {activeTab === 'residents' && <ResidentsTab />}
      </div>
    </div>
  )
}
