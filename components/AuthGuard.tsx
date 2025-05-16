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

  console.log('🔐 AuthGuard mounted')

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSession = async (session: any) => {
      if (!session?.user) {
        console.warn('🚧 Would redirect to /login')
        // router.replace('/login')
        return
      }

      const { data: systemUser, error: userError } = await supabase
        .from('users')
        .select()
        .eq('user_id', session.user.id)
        .single()

      if (userError || !systemUser) {
        console.error('User fetch error:', userError)
        console.warn('🚧 Would redirect to /login')
        // router.replace('/login')
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
          console.warn('🚧 Would redirect to /login')
          // router.replace('/login')
          return
        }

        // Clean up ?code from URL
        window.history.replaceState({}, '', window.location.pathname)

        // Fetch session after code exchange
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession()

        if (sessionError || !session?.user) {
          console.error('Session error after exchange:', sessionError)
          console.warn('🚧 Would redirect to /login')
          // router.replace('/login')
          return
        }

        console.log('Session after code exchange:', session)
        await handleSession(session)
        return
      }

      // Regular session check
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      if (error || !session?.user) {
        console.error('Regular session error:', error)
        console.warn('🚧 Would redirect to /login')
        // router.replace('/login')
        return
      }

      console.log('Regular session:', session)
      await handleSession(session)
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await handleSession(session)
        } else {
          console.warn('🚧 Would redirect to /login')
          // router.replace('/login')
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [dispatch, router, searchParams])

  if (loading) return <LoadingSkeleton />
  return <>{children}</>
}
