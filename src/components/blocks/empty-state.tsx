import { Button } from '@/components/ui/button'
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <EmptyPlaceholder className="max-w-md py-12">
      <EmptyPlaceholder.Icon>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </EmptyPlaceholder.Icon>
      <EmptyPlaceholder.Title>{title}</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>{description}</EmptyPlaceholder.Description>
      {actionLabel && onAction ? (
        <EmptyPlaceholder.Action>
          <Button onClick={onAction}>{actionLabel}</Button>
        </EmptyPlaceholder.Action>
      ) : null}
    </EmptyPlaceholder>
  )
}
