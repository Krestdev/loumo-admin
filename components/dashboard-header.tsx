'use client'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { usePathname } from 'next/navigation'
import { sidebarContent } from '@/data/navigation';

function DashboardHeader() {

    const pathname = usePathname();
    const paths = pathname.split('/').filter(path => path);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{sidebarContent.flatMap(x=>x.items).find(y=>y.url === pathname)?.header || "Dashboard"}</h1>
            {sidebarContent.flatMap(x=>x.items).find(y=>y.url === pathname)?.description && 
            <p className="text-sm text-muted-foreground">{sidebarContent.flatMap(x=>x.items).find(y=>y.url === pathname)?.description}</p>
            }
          </div>
        </div>
      </header>
  )
}

export default DashboardHeader