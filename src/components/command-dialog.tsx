"use client"

import {
  Calculator,
  Calendar,
  CreditCard,
  GearFine,
  Smiley,
  User,
} from "@phosphor-icons/react" // all these have to be replaced with geist icons

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "./ui/button"
import { CommandIcon, MagnifyingGlassIcon } from "./icons"
import * as React from "react"


export function CommandDialogButton({navCollapsed}: {navCollapsed: boolean}) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      {
        navCollapsed ?
          <Button onClick={() => {setOpen(true)}} variant='secondary' size='icon' className="size-10">
            <CommandIcon className="size-4 bg-transparent" />
          </Button>
        :
          <Button
            size={'lg'}
            variant={'secondary'}
            onClick={() => {setOpen(true)}}
            className="w-full relative bg-input hover:bg-input shadow-none flex justify-between text-muted-foreground p-2 px-4"
          >
            <MagnifyingGlassIcon className="absolute left-3 top-3 size-4" />
            <p className={`pl-5 truncate`}>Commands</p>
            <p className={`text-sm`}>
              <kbd className="pointer-events-none right-2 top-2.5 inline-flex h-5 select-none items-center gap-1 rounded border shadow bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>J
              </kbd>
            </p>
          </Button>
      }
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smiley className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GearFine className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
