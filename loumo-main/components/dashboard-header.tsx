'use client'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { usePathname } from 'next/navigation'
import { sidebarContent } from '@/data/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useStore } from '@/providers/datastore';

function DashboardHeader() {

    const pathname = usePathname();
    const { source, setSource } = useStore();
    //const paths = pathname.split('/').filter(path => path);

  return (
    <header className="flex h-16 sticky top-0 z-10 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">{sidebarContent.flatMap(x=>x.items).find(y=>y.url === pathname)?.header || "Dashboard"}</h1>
            {sidebarContent.flatMap(x=>x.items).find(y=>y.url === pathname)?.description && 
            <p className="text-sm text-muted-foreground">{sidebarContent.flatMap(x=>x.items).find(y=>y.url === pathname)?.description}</p>
            }
          </div>
        </div>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger>
            <SelectValue placeholder={"Sélectionner"}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"both"}>{"Tous"}</SelectItem>
            <SelectItem value={"web"}>{"Site Web"}</SelectItem>
            <SelectItem value={"mobile"}>{"Application Mobile"}</SelectItem>
          </SelectContent>
        </Select>
      </header>
  )
}

export default DashboardHeader