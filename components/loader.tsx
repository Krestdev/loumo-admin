"use client";

import { motion, AnimatePresence } from "framer-motion";

type LoadingPageProps = {
  isLoading: boolean;
};

export default function LoaderState({ isLoading }: LoadingPageProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="w-full h-full inset-0 flex items-center justify-center bg-white z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-48 h-2 bg-gray-200 rounded overflow-hidden relative">
            <div className="loader-bar absolute top-0 left-0 w-full h-full bg-primary" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
