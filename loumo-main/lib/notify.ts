// lib/notify.ts
import { ToastData } from "@/types/types";

type Listener = (toast: ToastData) => void;

let listeners: Listener[] = [];

export function subscribeToToasts(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function notify(toast: ToastData) {
  listeners.forEach((listener) => listener(toast));
}

// Helpers pratiques
export const notifySuccess = (title: string, description?: string) =>
  notify({ id: crypto.randomUUID(), title, description, variant: "success", duration: 5000 });

export const notifyError = (title: string, description?: string) =>
  notify({ id: crypto.randomUUID(), title, description, variant: "error", duration: 5000 });

export const notifyWarning = (title: string, description?: string) =>
  notify({ id: crypto.randomUUID(), title, description, variant: "warning", duration: 5000 });

export const notifyInfo = (title: string, description?: string) =>
  notify({ id: crypto.randomUUID(), title, description, variant: "default", duration: 5000 });
