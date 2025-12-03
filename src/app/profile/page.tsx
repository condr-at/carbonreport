'use client'

import { Suspense } from 'react'
import { UserProfileSettings } from './user-profile-settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layouts/page-header'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Update your name, job title, timezone, and avatar." />
      <Suspense fallback={<ProfileSettingsFallback />}>
        <UserProfileSettings />
      </Suspense>
    </div>
  )
}

function ProfileSettingsFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  )
}
