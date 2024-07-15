"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import * as React from "react"
import { cn } from "@/lib/utils"
import { testConnection } from "@/lib/pg"
import { Button } from "@/components/ui/button"
import { Connection } from "@prisma/client/edge"
import { fetchConnections } from "@/lib/actions"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useQueryToolContext } from "@/lib/hooks/querytoolsettings"
import { DatabaseIcon, LoadingIcon } from "../icons"


export default function ConnectionSelector() {

  const { setQueryToolSettings } = useQueryToolContext();

  const [open, setOpen] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string>("")
  const [connections, setConnections] = React.useState<Connection[]>([]);

  React.useEffect(() => {
    const getConnections = async () => {
      await fetchConnections().then((res: Connection[]) => {setConnections(res || [])})
    };
    getConnections();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-52 shadow-none justify-between"
        >
          <div className="flex gap-2 items-center">
            <DatabaseIcon className="size-4 mr-2" />
            <p className="truncate">
              {value
                ? connections?.find((connection) => connection.databaseName === value)?.databaseName
                : "Select connection..."}
            </p>
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandInput placeholder="Search connections..." className="h-9" />
          {/* <CommandEmpty>No connection found.</CommandEmpty> */}
          <CommandGroup>
            {connections?.map((connection, key) => (
              <div
                key={key}
                onClick={() => {
                  setValue(connection.databaseName)
                  testConnection(connection.protocol)
                  setQueryToolSettings({connection})
                  setOpen(false)
                }}
                data-selected={value==connection?.databaseName}
                className="hover:bg-secondary text-start justify-start flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50"
              >
                <p>{connection?.databaseName}</p>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === connection.databaseName ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
            ))}
            {!connections && <LoadingIcon className="w-4"/>}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
