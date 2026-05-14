'use client';

import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('dashboard-layout');
    return () => document.body.classList.remove('dashboard-layout');
  }, []);

  return <>{children}</>;
}
