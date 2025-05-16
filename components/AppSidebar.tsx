import { Calendar, Home, Search, Settings } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useAppSelector } from '@/lib/redux/hook'
import { supabase } from '@/lib/supabase/client'
import { Barangay } from '@/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/home',
    icon: Home
  },
  {
    title: 'Data Processing Agreement',
    url: '/data-processing-agreement',
    icon: Calendar
  },
  {
    title: 'Data Privacy',
    url: '/privacy-policy',
    icon: Search
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

export function AppSidebar() {
  const user = useAppSelector((state) => state.user.user)
  const [barangays, setBarangays] = useState<Barangay[]>([])
  const barangay = useAppSelector((state) => state.barangay.selectedBarangay)

  const pathname = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetched barangays from sidebar')
      // get barangay
      const { data } = await supabase
        .from('barangays')
        .select()
        .eq('owner_id', user?.system_user_id)
        .order('id', { ascending: true })

      if (data) {
        setBarangays(data)
      }
    }
    void fetchData()
  }, [barangay, user])

  return (
    <Sidebar className="pt-13">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="text-gray-400" />
                      <span className="text-gray-300">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="border-t rounded-none border-gray-600">
            Barangays
          </SidebarGroupLabel>
          <SidebarGroupContent className="pb-20">
            <SidebarMenu>
              {barangays.map((item, idx) => {
                const isActive = pathname === `/${item.id}`

                return (
                  <SidebarMenuItem
                    key={idx}
                    className="rounded-xl"
                    style={{
                      backgroundColor: isActive ? '#49494a' : 'transparent'
                    }}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={`/${item.id}`}>
                        <button
                          type="button"
                          className="w-4 h-4 rounded-full relative"
                          style={{ backgroundColor: item.color }}
                        ></button>
                        <span className="text-gray-300">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
