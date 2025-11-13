'use client'

import { Button } from '@/components/ui/button'
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionDisabled?: boolean
  actionTooltip?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionDisabled = false,
  actionTooltip,
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
          {actionTooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button onClick={actionDisabled ? undefined : onAction} disabled={actionDisabled}>
                    {actionLabel}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{actionTooltip}</TooltipContent>
            </Tooltip>
          ) : (
            <Button onClick={actionDisabled ? undefined : onAction} disabled={actionDisabled}>
              {actionLabel}
            </Button>
          )}
        </EmptyPlaceholder.Action>
      ) : null}
    </EmptyPlaceholder>
  )
}
