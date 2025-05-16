'use client'

import { Greeting } from '@/components/Greeting'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { useAppSelector } from '@/lib/redux/hook'
import { supabase } from '@/lib/supabase/client'
import { Barangay } from '@/types'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page() {
  const user = useAppSelector((state) => state.user.user)

  const [barangays, setBarangays] = useState<Barangay[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // get barangay
      const { data } = await supabase
        .from('barangays')
        .select()
        .eq('owner_id', user?.system_user_id)

      if (data) {
        setBarangays(data)
      }
      setLoading(false)
    }
    void fetchData()
  }, [])

  return (
    <div className="w-full">
      <div className="app__title">
        <h1 className="text-xl font-semibold">Home</h1>
      </div>

      <div className="mt-4 grid gap-4">
        <div className="text-center">
          <Greeting name={user?.name ?? ''} />
        </div>
        <div className="space-x-4 m-4 space-y-4 border p-4 rounded-xl">
          <div className="text-center">
            <Link
              href="/create-barangay"
              className="flex justify-center items-center gap-2"
            >
              <button
                type="button"
                className="w-10 h-10 border border-dashed rounded-md flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-700">Create Barangay</span>
            </Link>
          </div>
          {loading && <LoadingSkeleton />}

          {barangays?.map((item, idx) => (
            <Link
              key={idx}
              href={`/${item.id}`}
              className="space-x-1 space-y-4"
            >
              <button
                type="button"
                className="w-4 h-4 rounded-full relative"
                style={{ backgroundColor: item.color }}
              ></button>

              <span className="">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
