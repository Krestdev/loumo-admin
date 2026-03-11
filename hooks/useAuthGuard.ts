'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/providers/datastore';

export default function useAuthGuard({ requireAuth = true }: { requireAuth?: boolean } = {}) {
  const user = useStore((state) => state.user);
  const isHydrated = useStore((state) => state.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return; // ⛔ attendre que les données soient chargées
    
    if (requireAuth && !user) {
      router.push('/login');
    } else if (!requireAuth && user) {
      router.push('/dashboard');
    }
  }, [user, requireAuth, router, isHydrated]);
}
