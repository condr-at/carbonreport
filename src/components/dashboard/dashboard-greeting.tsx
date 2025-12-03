'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardGreetingProps {
  name?: string | null;
  hasVisited: boolean;
}

export function DashboardGreeting({ name, hasVisited }: DashboardGreetingProps) {
  const [cachedName, setCachedName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('dashboard_user_name');
    if (stored) {
      setCachedName(stored);
    }
  }, []);

  useEffect(() => {
    if (name) {
      localStorage.setItem('dashboard_user_name', name);
      setCachedName(name);
    }
  }, [name]);

  // If we are on the server (not mounted) and name is undefined, we must render what the server renders (Skeleton)
  // to avoid hydration mismatch, UNLESS we use suppressHydrationWarning.
  // But we can't read localStorage on server anyway.
  
  const effectiveName = name ?? cachedName;
  const baseGreeting = hasVisited ? 'Welcome back' : 'Welcome';

  // If we have a name, show the greeting.
  if (effectiveName) {
    return (
      <span>
        {baseGreeting}, {effectiveName}
      </span>
    );
  }

  // If name is explicitly null (loaded but no name), show just base greeting.
  if (name === null) {
     return <span>{baseGreeting}</span>;
  }

  // Loading state (name undefined and no cache)
  return <Skeleton className="h-8 w-64" />;
}
