import React from "react";

import { ToastContainer } from "react-toastify";

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      {children}
      <ToastContainer />
    </React.Fragment>
  );
};

export default NotificationProvider;
