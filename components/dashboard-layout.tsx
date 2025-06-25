import React from 'react'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { AppSidebar } from './app-sidebar'

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>{children}</SidebarInset>
        {/**Toaster to add here */}
    </SidebarProvider>
  )
}

export default DashboardLayout