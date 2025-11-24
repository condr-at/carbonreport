'use client';

import { useEffect } from 'react';

export function MarkDashboardVisited() {
  useEffect(() => {
    if (!document.cookie.includes('dashboard_visited=true')) {
      document.cookie = 'dashboard_visited=true; path=/; max-age=31536000'; // 1 year
    }
  }, []);

  return null;
}
