'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

type User = {
  id: string
  email: string
}

const roles = ['admin', 'viewer', 'editor'] as const

export default function AddMemberModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Search user from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      if (!query) return setResults([])
      const { data } = await supabase
        .from('users')
        .select('id, email')
        .ilike('email', `%${query}%`)
        .limit(5)
      setResults(data || [])
    }

    const delay = setTimeout(() => fetchUsers(), 300)
    return () => clearTimeout(delay)
  }, [query])

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setQuery('')
    setResults([])
  }

  const handleInvite = async () => {
    if (!selectedUser) return
    setLoading(true)

    // Create user if not exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', selectedUser.email)
      .single()

    let userId = existingUser?.id

    if (!userId) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({ email: selectedUser.email })
        .select()
        .single()
      userId = newUser?.id

      // Send email with login link via Resend or Supabase
      // await resend.emails.send({
      //   to: selectedUser.email,
      //   subject: 'Join our app',
      //   html: `<a href="https://your-app.com/login?email=${selectedUser.email}">Click here to login</a>`
      // })
    }

    // Assign roles (save to a members table)
    await supabase.from('members').insert({
      user_id: userId,
      roles: selectedRoles,
      invited_by: 'your_user_id_here'
    })

    setLoading(false)
    onClose()
    setSelectedUser(null)
    setSelectedRoles([])
  }

  const handleRemove = () => {
    setSelectedUser(null)
    setSelectedRoles([])
  }

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-xl space-y-2 pb-10">
            <DialogTitle className="flex items-center justify-between border-b p-4 text-lg font-medium">
              Invite Member
              <button
                onClick={onClose}
                className="text-gray-500 cursor-pointer hover:text-red-500 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogTitle>

            <div className="p-4">
              {!selectedUser && (
                <div className="space-y-2">
                  <div>Invite with email</div>
                  <Input
                    placeholder="Search or enter google email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              )}

              {/* Search Results */}
              {results.length > 0 && !selectedUser && (
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  {results.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {user.email}
                    </button>
                  ))}
                </div>
              )}
              <div className="text-gray-400 text-xs mt-2">
                Only Google email is allowed
              </div>

              {/* Fallback to email input */}
              {query &&
                results.length === 0 &&
                !selectedUser &&
                query.includes('@') && (
                  <button
                    onClick={() =>
                      handleSelectUser({ id: 'new', email: query })
                    }
                    className="w-full text-left px-4 py-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Invite <strong>{query}</strong>
                  </button>
                )}

              {/* Selected User Info */}
              {selectedUser && (
                <div className="flex items-center justify-between border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {selectedUser.email}
                  </span>
                  <button onClick={handleRemove}>
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              )}

              {/* Role Selection */}
              {selectedUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign roles:</label>
                  <div className="flex gap-3 flex-wrap">
                    {roles.map((role) => (
                      <label
                        key={role}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role)}
                          onChange={() => toggleRole(role)}
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Invite Button */}
              {selectedUser && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleInvite}
                    disabled={loading || selectedRoles.length === 0}
                  >
                    {loading ? 'Inviting...' : 'Invite User'}
                  </Button>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  )
}
