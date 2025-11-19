'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '@/lib/data-client/queryClient';
import { OrganizationProvider } from '@/lib/organizations/context';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';

const PUBLIC_ROUTES = new Set([
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
]);

function isPublicRoute(pathname: string | null) {
  if (!pathname) {
    return true;
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    return true;
  }

  for (const route of PUBLIC_ROUTES) {
    if (route !== '/' && pathname.startsWith(`${route}/`)) {
      return true;
    }
  }

  return false;
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [client] = useState(() => createQueryClient());
  const pathname = usePathname();

  const content = useMemo(() => {
    if (isPublicRoute(pathname)) {
      return children;
    }

    return <OrganizationProvider>{children}</OrganizationProvider>;
  }, [children, pathname]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={client}>
        {content}
        {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
