'use client'
import { LoginForm } from "@/components/login-form";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useStore } from "@/providers/datastore";
import { Loader2 } from "lucide-react";

export default function LoginPage() {

  const {isHydrated} = useStore();
    useAuthGuard({requireAuth: false});

    if(!isHydrated){
        return <div className="w-full h-screen grid place-items-center">
            <Loader2 size={20} className="animate-spin"/>
        </div>;
    }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl flex flex-col gap-10">
        <img src="logo.svg" alt="logo" className="h-10 w-auto" />
        <LoginForm />
        <div className="text-sm text-center text-gray-400">
          {"Version 1.1. Développé par "}
          <a
            href="https://www.krestdev.com"
            className="text-primary font-semibold"
          >
            {"KrestDev"}
          </a>
          <span>{". © 2025, Tous les droits réservés."}</span>
        </div>
      </div>
    </div>
  );
}
