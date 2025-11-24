import type { ReactNode } from 'react'
import { PageHeader as UiPageHeader } from '@/components/ui/page-header'

interface PageHeaderProps {
  title: ReactNode
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <UiPageHeader className={className}>
      <div className="space-y-1">
        <UiPageHeader.Heading>{title}</UiPageHeader.Heading>
        {description ? <UiPageHeader.Description>{description}</UiPageHeader.Description> : null}
      </div>
      {actions ? <UiPageHeader.Actions>{actions}</UiPageHeader.Actions> : null}
    </UiPageHeader>
  )
}
