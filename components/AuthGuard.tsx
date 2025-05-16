'use client'

import { setUser } from '@/lib/redux/userSlice'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: systemUser } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.id)
        .single()

      if (systemUser) {
        dispatch(
          setUser({
            ...user,
            system_user_id: systemUser.id,
            name: systemUser.name
          })
        )
        console.log('triggered user dispatch initAuth')
      }

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
                name: systemUser.name
              })
            )
            console.log('triggered user dispatch listener')
          }
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [dispatch, router])

  if (loading) return null

  return <>{children}</>
}
