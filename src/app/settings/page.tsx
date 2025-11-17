import { redirect } from 'next/navigation'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const params = new URLSearchParams()

  Object.entries(resolvedSearchParams ?? {}).forEach(([key, value]) => {
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
