"use client";
import React from "react";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
};

function PageLayout({ isLoading, children, className }: Props) {
  return (
    <AnimatePresence>
      {!isLoading && (
        <motion.main
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(className)}
        >
          {children}
        </motion.main>
      )}
    </AnimatePresence>
  );
}

export default PageLayout;
