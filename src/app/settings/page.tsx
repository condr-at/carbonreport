import { redirect } from 'next/navigation'

type SettingsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = new URLSearchParams()

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item ?? ''))
    } else if (typeof value === 'string') {
      params.set(key, value)
    }
  })

  const query = params.toString()
  const target = query ? `/settings/profile?${query}` : '/settings/profile'

  redirect(target)
}
