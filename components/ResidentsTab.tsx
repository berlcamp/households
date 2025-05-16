'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Resident, RootState } from '@/types'
import { HomeIcon } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export const ResidentsTab = () => {
  const list: Resident[] = useSelector(
    (state: RootState) => state.stocksList.value
  )

  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  )

  return (
    <div className="bg-gray-300 dark:bg-[#1f1f1f]">
      {list.length === 0 && (
        <p className="p-4 text-muted-foreground">No residents found.</p>
      )}

      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {list.map((resident, idx) => (
          <li
            key={idx}
            className="p-4 flex justify-between items-center hover:bg-muted/50 cursor-pointer transition"
            onClick={() => setSelectedResident(resident)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{resident.fullname}</span>
              {resident.barangay && (
                <span className="text-sm text-muted-foreground">
                  {resident.barangay}
                </span>
              )}
            </div>
            {resident.hasHousehold && (
              <HomeIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            )}
          </li>
        ))}
      </ul>

      <Sheet
        open={!!selectedResident}
        onOpenChange={() => setSelectedResident(null)}
      >
        <SheetContent side="right" className="w-[400px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Resident Details</SheetTitle>
            <SheetDescription>
              View more information about this resident.
            </SheetDescription>
          </SheetHeader>

          {selectedResident && (
            <div className="mt-4 px-4 space-y-2 text-sm">
              <div>
                <strong>Full Name:</strong> {selectedResident.fullname}
              </div>
              <div>
                <strong>Address:</strong> {selectedResident.barangay || 'N/A'}
              </div>
              <div>
                <strong>Household Member:</strong>{' '}
                {selectedResident.hasHousehold ? 'Yes' : 'No'}
              </div>
              {/* Add more details here as needed */}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
