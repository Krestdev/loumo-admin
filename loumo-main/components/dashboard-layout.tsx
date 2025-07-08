import React from 'react'
import { AppSidebar } from './app-sidebar'
import DashboardHeader from './dashboard-header'
import GlobalLoader from './global-loader'
import { SidebarInset, SidebarProvider } from './ui/sidebar'

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <DashboardHeader/>
          <GlobalLoader/>
            {children}
          </SidebarInset>
        {/**Toaster to add here */}
    </SidebarProvider>
  )
}

export default DashboardLayout