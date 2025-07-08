"use client";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  isLoading: boolean;
  title: string;
  description?:string;
};

export default function ModalLayout({ children, isLoading, title, description }: Props) {
  const router = useRouter();
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        onClick={() => router.back()}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-50 w-full max-w-[90vw] md:max-w-2xl bg-white rounded-xl shadow-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <PageLayout isLoading={isLoading} className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg leading-none font-semibold">
                  {title}
                </h2>
                { description && <p className="text-muted-foreground text-sm">
                  {description}
                </p>}
              </div>
              <Button
                onClick={() => router.back()}
                variant={"ghost"}
                size={"icon"}
              >
                <X size={20} />
              </Button>
            </div>
            {children}
          </PageLayout>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
