// components/GlobalLoader.tsx
"use client";

import { useStore } from "@/providers/datastore";
import LoaderState from "./loader";

export default function GlobalLoader() {
  const isLoading = useStore((state)=> state.isLoading);
  return <LoaderState isLoading={isLoading}/>;
}
