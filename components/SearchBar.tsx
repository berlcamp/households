'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'

const SearchButton = () => (
  <button type='submit' className='-ml-3 z-10'>
    Search
  </button>
)

const SearchBar = ({ searchKeyword }: { searchKeyword?: string }) => {
  const [keyword, setKeyword] = useState(searchKeyword && searchKeyword !== '' ? searchKeyword : '')

  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Create a new URLSearchParams object using the current URL search parameters
    const searchParams = new URLSearchParams(window.location.search)

    const kwrd = keyword.replace(/,/g, '')
    console.log(kwrd.trim())

    searchParams.set('keyword', kwrd)

    // Generate the new pathname with the updated search parameters
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`

    router.push(newPathname)
  }

  const handleReset = () => {
    setKeyword('')
    // Create a new URLSearchParams object using the current URL search parameters
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('keyword')

    // Generate the new pathname with the updated search parameters
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`

    router.push(newPathname)
  }

  return (
    <form onSubmit={handleSearch} className='flex items-center justify-center relative'>
      <input
        type='text'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search'
        className=' my-4 px-4 pr-10 w-full py-2 border-2 rounded-full outline-none text-gray-700'
      />
      {
        keyword !== '' &&
          <button type='button' onClick={handleReset} className='absolute right-4'>
            <XMarkIcon className='w-6 h-6 text-gray-700'/>
          </button>
      }
    </form>
  )
}

export default SearchBar