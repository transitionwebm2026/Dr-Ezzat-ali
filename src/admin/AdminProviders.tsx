'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { PublishProvider } from './publish/PublishProvider';
import { ToastProvider } from './ui/Toast';

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <PublishProvider>{children}</PublishProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
