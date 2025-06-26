import React from 'react'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { AppSidebar } from './app-sidebar'
import DashboardHeader from './dashboard-header'

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <DashboardHeader/>
          {children}
          </SidebarInset>
        {/**Toaster to add here */}
    </SidebarProvider>
  )
}

export default DashboardLayout