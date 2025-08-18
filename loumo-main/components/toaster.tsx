"use client"

import { Button } from "@/components/ui/button"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { useStore } from "@/providers/datastore"
import { ToastData } from "@/types/types"
import { cva } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, TriangleAlert, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Progress = {
  id: string;
  duration: number;
};

export function useAutoDismissToast(
  id: string,
  duration = 5000,
  onComplete: () => void
) {
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);

      setProgressList((prev) => {
        const exists = prev.find((p) => p.id === id);
        if (exists) {
          return prev.map((p) =>
            p.id === id ? { ...p, duration: remaining } : p
          );
        } else {
          return [...prev, { id, duration: remaining }];
        }
      });

      if (remaining <= 0 && timerRef.current !== null) {
        clearInterval(timerRef.current);
        onComplete();
      }
    }, 100);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [id, duration, onComplete]);

  const progress = progressList.find((p) => p.id === id)?.duration ?? duration;

  return { progress };
}


function ToastIcon({ variant }: { variant?: ToastData["variant"] }) {
  switch (variant) {
    case "success":
      return <CheckCircle2 size={16}/>
    case "error":
      return <TriangleAlert size={16}/>
    case "warning":
      return <AlertCircle size={16}/>
    default:
      return <Info size={16}/>
  }
}

const toastVariants = cva("flex w-full justify-between gap-3",
  {
    variants:{
      variant:{
        default : "text-foreground",
        success: "text-emerald-700",
        warning: "text-orange-700",
        error: "text-red-700",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export default function Toaster() {
  const { toasts, removeToast } = useStore();

  return (
    <ToastProvider swipeDirection="left">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id)
          }}
          variant={toast.variant ?? "default"}
        >
          <ToastContent toast={toast} onClose={() => removeToast(toast.id)} />
        </Toast>
      ))}
      <ToastViewport className="sm:left-auto sm:right-0" />
    </ToastProvider>
  )
}

function ToastContent({
  toast,
  onClose,
}: {
  toast: ToastData
  onClose: () => void
}) {
  const { progress } = useAutoDismissToast(
    toast.id,
    toast.duration,
    onClose
  );

  const progressColor = (variant: ToastData["variant"]):string => {
    switch(variant){
      case "default":
        return "bg-gray-600";
      case "error":
        return "bg-red-600";
      case "success":
        return "bg-emerald-500";
      case "warning":
        return "bg-orange-600";
      default: return "bg-gray-600";
    }
  }

  return (
    <>
      <div className={cn(toastVariants({variant: toast.variant}))}>
        <div className="mt-0.5 shrink-0">
          <ToastIcon variant={toast.variant} />
        </div>
        <div className="flex grow flex-col gap-3">
          <div className="space-y-1">
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          {toast.action && (
            <ToastAction altText={toast.action.label} asChild>
              <Button size="sm" onClick={toast.action.onClick}>
                {toast.action.label}
              </Button>
            </ToastAction>
          )}
        </div>
        <ToastClose asChild>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            aria-label="Fermer"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </ToastClose>
      </div>
      <div className="contents" aria-hidden="true">
        <div
          className={cn("pointer-events-none absolute bottom-0 left-0 h-1 w-full", progressColor(toast.variant))}
          style={{
            width: `${(progress / (toast.duration ?? 5000)) * 100}%`,
            transition: "width 100ms linear",
          }}
        />
      </div>
    </>
  )
}
