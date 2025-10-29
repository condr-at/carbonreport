"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"

type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive>

type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>

type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>

type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>

type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>

type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>

type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>

type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>((
  { className, ...props },
  ref
) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
)
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<React.ElementRef<typeof CommandPrimitive.List>, CommandListProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List
      ref={ref}
      className={cn("max-h-64 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
)
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Empty>, CommandEmptyProps>(
  (props, ref) => (
    <CommandPrimitive.Empty
      ref={ref}
      className="py-6 text-center text-sm"
      {...props}
    />
  )
)
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Group>, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        "overflow-hidden px-2 py-2 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-item]]:px-2",
        className
      )}
      {...props}
    />
  )
)
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Separator>, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
)
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Item>, CommandItemProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
)
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
}
