'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Mail } from 'lucide-react'
import { useState } from 'react'

export default function LoginBox({ message }: { message?: string }) {
  const [error, setError] = useState('')
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-purple-900 to-emerald-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {message || 'Welcome Back'}
          </h1>
          <div className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            You are required to login
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <Mail className="w-4 h-4" />
          Login with Google
        </Button>
      </div>
    </div>
  )
}
