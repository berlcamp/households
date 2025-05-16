/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { setBarangay } from '@/lib/redux/barangaySlice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Check, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AddMemberModal from './AddMemberModal'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

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

export const OverviewTab = () => {
  const barangay = useAppSelector((state) => state.barangay.selectedBarangay)

  const [selectedColor, setSelectedColor] = useState(barangay?.color || 'gray')
  const [name, setName] = useState(barangay?.name || '')
  const [description, setDescription] = useState(barangay?.description || '')
  const [loading, setLoading] = useState(false)
  const [showSave, setShowSave] = useState(false)
  const [open, setOpen] = useState(false)

  const dispatch = useAppDispatch()

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Barangay name is required.')
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('barangays')
      .update({
        name: name.trim(),
        description: description.trim(),
        color: selectedColor
      })
      .eq('id', barangay?.id)
      .select()

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      dispatch(setBarangay(data[0]))
      toast.success('Successfully saved')
    }
  }

  // Update state if selected barangay changes
  useEffect(() => {
    setSelectedColor(barangay?.color || 'gray')
    setName(barangay?.name || '')
    setDescription(barangay?.description || '')
  }, [barangay])

  // Detect unsaved changes
  useEffect(() => {
    const hasChanges =
      name !== (barangay?.name || '') ||
      description !== (barangay?.description || '') ||
      selectedColor !== (barangay?.color || '')
    setShowSave(hasChanges)
  }, [name, description, selectedColor, barangay])

  return (
    <div className="lg:grid grid-cols-2 min-h-screen">
      <div className="p-4 flex flex-col gap-4 lg:border-r h-full">
        <div>
          <Input
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Textarea
            className="w-full"
            value={description}
            placeholder="Write description"
            onChange={(e) => setDescription(e.target.value)}
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

        {showSave && (
          <div className="space-x-2 mt-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50">
        <h1 className="text-lg font-semibold">Members</h1>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-10 h-10 cursor-pointer bg-white border border-gray-500 border-dashed rounded-full flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700">Add Member</span>
          </div>
        </div>
      </div>
      <AddMemberModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
