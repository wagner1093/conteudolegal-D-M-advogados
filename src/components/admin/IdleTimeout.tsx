'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos

export default function IdleTimeout() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        // Desloga usuário
        await supabase.auth.signOut();
        router.push('/login?message=Sua sessão expirou por inatividade.');
      }, TIMEOUT_MS);
    };

    // Eventos que reiniciam o timer
    const events = ['mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mouseWheel', 'mousedown', 'touchstart', 'touchmove', 'MSPointerDown', 'MSPointerMove', 'visibilitychange'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, false);
    });

    // Inicia o timer na montagem
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, false);
      });
    };
  }, [router]);

  if (!isClient) return null;

  return null;
}
