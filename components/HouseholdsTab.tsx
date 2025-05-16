/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook'
import { appendHouseholds, resetHouseholds } from '@/lib/redux/listSlice'
import { supabase } from '@/lib/supabase/client'
import { Household } from '@/types'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'

interface Props {
  barangayId: number
}

export function HouseholdsTab({ barangayId }: Props) {
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(
    null
  )
  const dispatch = useAppDispatch()
  const { households, householdsPage } = useAppSelector((state) => state.list)

  const fetchHouseholds = async (page: number) => {
    const { data, error } = await supabase
      .from('households')
      .select(
        '*, barangay:barangay_id(*), members:household_members(*, resident:resident_id(*))'
      )
      .eq('barangay_id', barangayId)
      .range((page - 1) * 10, page * 10 - 1)

    if (error) {
      console.error('Error fetching households:', error)
      return
    }

    dispatch(appendHouseholds(data ?? []))
    dispatch({ type: 'list/setHouseholdsPage', payload: page }) // 👈 update the page

    console.log('Fetching page:', page)
  }

  // Reset and fetch on barangayId change
  useEffect(() => {
    dispatch(resetHouseholds())
    void fetchHouseholds(1)
  }, [barangayId])

  const handleShowMore = () => {
    void fetchHouseholds(householdsPage + 1)
  }

  return (
    <div className="dark:bg-[#1f1f1f]">
      {households.length === 0 ? (
        <p className="p-4 text-muted-foreground">No households found.</p>
      ) : (
        <div className="text-sm border-t border-gray-300 dark:border-gray-700">
          {/* Header */}
          <div className="grid grid-cols-[100px_1fr] font-semibold px-2 py-2 border-b dark:border-gray-700">
            <div>ID</div>
            <div>Members</div>
          </div>

          {/* Rows */}
          {households.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[100px_1fr] px-2 py-2 border-b dark:border-gray-700 cursor-pointer hover:bg-muted/50 transition"
              onClick={() => setSelectedHousehold(item)}
            >
              <div>{item.id}</div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {item.members?.map((member, idx2) => (
                    <div key={idx2} className="flex items-center space-x-1">
                      <Avatar className="w-6 h-6 text-[10px]">
                        <AvatarFallback className="bg-gray-300 dark:bg-gray-700 font-semibold">
                          {member.resident?.fullname
                            ?.split(' ')
                            .map((w) => w[0]?.toUpperCase())
                            .join('')
                            .slice(0, 2) ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Short name for small screens */}
                      <span className="text-sm font-medium lg:hidden">
                        {member.resident.fullname?.length > 10
                          ? member.resident.fullname.slice(0, 10) + '..'
                          : member.resident.fullname}
                      </span>
                      {/* Full name for large screens */}
                      <span className="text-sm font-medium hidden lg:inline">
                        {member.resident.fullname}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {households.length > 0 && (
        <div className="text-center mt-4">
          <button onClick={handleShowMore} className="text-blue-500 underline">
            Show more
          </button>
        </div>
      )}

      <Sheet
        open={!!selectedHousehold}
        onOpenChange={() => setSelectedHousehold(null)}
      >
        <SheetContent side="right" className="w-[400px] mt-13 sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Resident Details</SheetTitle>
            <SheetDescription>
              View more information about this resident.
            </SheetDescription>
          </SheetHeader>

          {selectedHousehold && (
            <div className="mt-4 px-4 space-y-2 text-sm">
              <div>
                <strong>ID:</strong> {selectedHousehold.id}
              </div>
              <div>
                <strong>Address:</strong>{' '}
                {selectedHousehold.barangay?.name || 'N/A'}
              </div>
              {/* Add more details as needed */}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
