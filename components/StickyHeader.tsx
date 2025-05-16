'use client'

import { Button } from '@/components/ui/button'

import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import HeaderDropdown from './HeaderDropdownMenu'
import { Input } from './ui/input'
import { SidebarTrigger } from './ui/sidebar'

export default function StickyHeader() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = async (searchTerm: string) => {
    // handle search code here
    console.log(searchTerm)
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
            handleSearch(searchTerm) // optionally call fetch manually
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
