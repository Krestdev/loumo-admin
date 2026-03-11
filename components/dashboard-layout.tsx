import React from "react";
import { AppSidebar } from "./app-sidebar";
import DashboardHeader from "./dashboard-header";
import GlobalLoader from "./global-loader";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <GlobalLoader />
        {children}
        <div className="py-5 flex items-center flex-wrap text-sm sm:text-base text-gray-600 justify-center">
          {"Version 1.1. Développé par"}
          <a
            href="https://www.krestdev.com"
            className="text-primary font-semibold ml-1"
          >
            {"KrestDev"}
          </a>
          <span>{". © 2025, Tous les droits réservés."}</span>
        </div>
      </SidebarInset>
      {/**Toaster to add here */}
    </SidebarProvider>
  );
}

export default DashboardLayout;
