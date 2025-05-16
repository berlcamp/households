import { getSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  //
  const supabase = await getSupabaseClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900">
      <div className="text-center">
        <h1 className="text-5xl text-white font-bold mb-4">
          Manage Households and Residents Effortlessly!
        </h1>
        <p className="text-xl text-white mb-8">
          A modern solution to streamline barangay household and resident
          records
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-black py-2 px-6 rounded-full font-semibold shadow-lg hover:bg-gray-200"
          >
            Get Started
          </Link>
          <Link
            href="/privacy-policy"
            className="bg-white text-black py-2 px-6 rounded-full font-semibold shadow-lg hover:bg-gray-200"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
