'use client'
import React from "react";
import NotificationProvider from "./notifications";
import QueryProvider from "./queryProvider";
import Toaster from "@/components/toaster";

function Providers({ children }: { children: React.ReactNode }) {

  return (
    <React.Fragment>
      <QueryProvider>
        <NotificationProvider>{children}</NotificationProvider>
        <Toaster/>
      </QueryProvider>
    </React.Fragment>
  );
}

export default Providers;
