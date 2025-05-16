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
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  const barangays = useAppSelector((state) => state.barangaysList.value)

  const pathname = usePathname()

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
