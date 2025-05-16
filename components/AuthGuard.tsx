/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { addList } from '@/lib/redux/barangaysSlice'
import { setUser } from '@/lib/redux/userSlice'
import { supabase } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import LoadingSkeleton from './LoadingSkeleton'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchBarangays = async (ownerID: number) => {
      const { data, error } = await supabase
        .from('barangays')
        .select()
        .eq('owner_id', ownerID)

      if (error) {
        console.error('Fetch barangays error:', error)
        return
      }

      if (data) {
        dispatch(addList(data))
      }
    }

    const handleSession = async (session: Session) => {
      if (!session?.user) {
        router.replace('/login')
        return
      }

      const { data: systemUser, error: userError } = await supabase
        .from('users')
        .select()
        .eq('user_id', session.user.id)
        .single()

      if (userError || !systemUser) {
        console.error('User fetch error:', userError)
        router.replace('/login')
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

      await fetchBarangays(systemUser.owner_id)
      setLoading(false)
    }

    const initAuth = async () => {
      const code = searchParams.get('code')

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('OAuth exchange error:', exchangeError)
          router.replace('/login')
          return
        }

        // Remove the code from the URL
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', window.location.pathname)
        }

        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          console.error('Session error after exchange:', sessionError)
          router.replace('/login')
          return
        }

        await handleSession(session)
        return
      }

      // Regular session check
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      if (error || !session) {
        console.error('Regular session error:', error)
        router.replace('/login')
        return
      }

      await handleSession(session)
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          await handleSession(session)
        } else {
          router.replace('/login')
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router, searchParams])

  if (loading) return <LoadingSkeleton />
  return <>{children}</>
}
