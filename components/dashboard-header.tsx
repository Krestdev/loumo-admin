'use client'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { usePathname } from 'next/navigation'

function DashboardHeader() {

    const pathname = usePathname();
    const paths = pathname.split('/').filter(path => path);
    console.log(paths);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble de votre activité</p>
          </div>
        </div>
      </header>
  )
}

export default DashboardHeader