// <ul className="space-y-1">
//   {household.members.map((member) => (
//     <li key={member.id} className="flex items-center justify-between">
//       <span>{member.fullname}</span>
//       {member.type === 'leader' && <UserIcon className="w-4 h-4" />}
//     </li>
//   ))}
// </ul>
'use client'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Household, RootState } from '@/types'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback } from './ui/avatar'

export const HouseholdsTab = () => {
  const list: Household[] = useSelector((state: RootState) => state.list.value)

  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(
    null
  )

  return (
    <div className="dark:bg-[#1f1f1f]">
      {list.length === 0 && (
        <p className="p-4 text-muted-foreground">No households found.</p>
      )}

      <div className="text-sm border-t border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="grid grid-cols-[100px_1fr] font-semibold px-2 py-2 border-b dark:border-gray-700">
          <div>ID</div>
          <div>Members</div>
        </div>

        {/* Rows */}
        {list.map((item, idx) => (
          <div
            key={idx}
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
                        {member.fullname
                          ?.split(' ')
                          .map((w) => w[0]?.toUpperCase())
                          .join('')
                          .slice(0, 2) ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Short name for small screens */}
                    <span className="text-sm font-medium lg:hidden">
                      {member.fullname.length > 10
                        ? member.fullname.slice(0, 10) + '..'
                        : member.fullname}
                    </span>
                    {/* Full name for large screens */}
                    <span className="text-sm font-medium hidden lg:inline">
                      {member.fullname}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

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
                <strong>Address:</strong> {selectedHousehold.barangay || 'N/A'}
              </div>
              {/* Add more details here as needed */}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
