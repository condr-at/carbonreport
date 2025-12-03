'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type BaseInputProps = React.ComponentProps<typeof Input>

export type PasswordInputProps = BaseInputProps & {
  wrapperClassName?: string
}

function isInvalid(value: BaseInputProps['aria-invalid']) {
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    return value === 'true'
  }
  return false
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const invalid = isInvalid(props['aria-invalid'])

    return (
      <div
        className={cn(
          'flex items-center rounded-md border border-input bg-background pr-1 transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          invalid && 'border-destructive focus-within:ring-destructive/40',
          wrapperClassName,
        )}
      >
        <Input
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          className={cn(
            'flex-1 border-0 bg-transparent pr-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
            className,
          )}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((value) => !value)}
          className="ml-1 h-8 w-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'
