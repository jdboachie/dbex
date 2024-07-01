'use client'

import * as React from 'react'
import { usePathname } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/utils";

export function SecondaryHeader() {
  const pathname = usePathname();
  const pathDisplay = capitalizeFirstLetter(pathname.split('/')[2])

  return (
    <p className="py-1.5 font-medium text-muted-foreground">{pathDisplay}</p>
  )
}