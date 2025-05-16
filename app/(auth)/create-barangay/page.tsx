'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/lib/redux/hook'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

const COLORS = [
  'blue',
  'yellow',
  'orange',
  'brown',
  'pink',
  'red',
  'gray',
  'violet'
]

export default function Page() {
  const user = useAppSelector((state) => state.user.user)

  const [selectedColor, setSelectedColor] = useState('gray')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Barangay name is required.')
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('barangays')
      .insert({
        owner_id: user?.system_user_id,
        name: name.trim(),
        color: selectedColor
      })
      .select('id')
      .single()

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else if (data?.id) {
      toast.success('Barangay created.')
      router.push(`/${data.id}`)
    }
  }

  return (
    <div className="w-full">
      <div className="app__title">
        <h1 className="text-xl font-semibold">New Barangay</h1>
      </div>

      <div className="mt-4 grid gap-4 px-4">
        <div>
          <div className="text-sm">Barangay Name</div>
          <Input
            className="w-full md:w-1/2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <div className="text-sm mb-2">Color</div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  'w-10 h-10 rounded-full relative border-2',
                  selectedColor === color
                    ? 'border-black'
                    : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-x-2 mt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Link href="/home">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
