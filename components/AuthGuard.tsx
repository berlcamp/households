'use client'

import { addList } from '@/lib/redux/barangaysSlice'
import { setUser } from '@/lib/redux/userSlice'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import LoadingSkeleton from './LoadingSkeleton'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const loadSessionAndUser = async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        console.error('No session found:', sessionError)
        router.replace('/auth/unverified') // Or login
        setLoading(false)
        return
      }

      const { data: systemUser, error: userError } = await supabase
        .from('users')
        .select()
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single()

      if (userError || !systemUser) {
        console.error('System user not found or inactive:', userError)
        await supabase.auth.signOut()
        router.replace('/auth/unverified')
        setLoading(false)
        return
      }

      dispatch(
        setUser({
          ...session.user,
          system_user_id: systemUser.id,
          owner_id: systemUser.owner_id,
          name: systemUser.name
        })
      )

      const { data: barangays, error: barangayError } = await supabase
        .from('barangays')
        .select()
        .eq('owner_id', systemUser.owner_id)

      if (barangayError) {
        console.error('Failed to load barangays:', barangayError)
      } else {
        dispatch(addList(barangays))
      }

      setLoading(false)
    }

    loadSessionAndUser()

    // Optional: handle logout cases live
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace('/auth/unverified')
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [dispatch, router])

  if (loading) return <LoadingSkeleton />
  return <>{children}</>
}
