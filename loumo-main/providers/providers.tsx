'use client'
import React from "react";
import NotificationProvider from "./notifications";
import QueryProvider from "./queryProvider";

function Providers({ children }: { children: React.ReactNode }) {

  return (
    <React.Fragment>
      <QueryProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </QueryProvider>
    </React.Fragment>
  );
}

export default Providers;
