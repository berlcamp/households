'use client'

import { addList } from '@/lib/redux/barangaysSlice'
import { setUser } from '@/lib/redux/userSlice'
import { supabase } from '@/lib/supabase/client'
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
    let sessionHandled = false

    const fetchBarangays = async (ownerID: number) => {
      const { data } = await supabase
        .from('barangays')
        .select()
        .eq('owner_id', ownerID)

      if (data) {
        dispatch(addList(data))
      }
    }

    const initAuth = async () => {
      const code = searchParams.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('OAuth exchange error:', error)
          window.location.href = '/login'
          return
        }

        // Clean up ?code from URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)

        // Wait for listener to handle session
        return
      }

      // No code, check existing session manually
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session?.user) {
        window.location.href = '/login'
        return
      }

      const { data: systemUser } = await supabase
        .from('users')
        .select()
        .eq('user_id', session.user.id)
        .single()

      if (systemUser) {
        dispatch(
          setUser({
            ...session.user,
            system_user_id: systemUser.id,
            owner_id: systemUser.owner_id,
            name: systemUser.name
          })
        )
        void fetchBarangays(systemUser.owner_id)
      }

      sessionHandled = true
      setLoading(false)
    }

    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          window.location.href = '/login'
        } else {
          const { data: systemUser } = await supabase
            .from('users')
            .select()
            .eq('user_id', session.user.id)
            .single()

          if (systemUser) {
            dispatch(
              setUser({
                ...session.user,
                system_user_id: systemUser.id,
                owner_id: systemUser.owner_id,
                name: systemUser.name
              })
            )
            void fetchBarangays(systemUser.owner_id)
          }

          if (!sessionHandled) {
            setLoading(false)
          }
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [dispatch, router, searchParams])

  if (loading) return <LoadingSkeleton />

  return <>{children}</>
}
