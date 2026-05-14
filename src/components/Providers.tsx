'use client';

import { ConfigProvider } from '@/context/ConfigContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
}
