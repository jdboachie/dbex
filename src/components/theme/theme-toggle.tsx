"use client";


import * as React from "react";
import { Moon as MoonIcon, Sun as SunIcon, Monitor as DesktopIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default" className="justify-start flex gap-2">
          <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute hsize-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <p className="text-secondary-foreground">Theme</p>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunIcon className="size-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon className="size-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <DesktopIcon className="size-4 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeToggleAlt() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center px-px gap-px border rounded-lg">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="icon"
        className="size-8 rounded-lg"
        onClick={() => setTheme("light")}
      >
        <SunIcon />
      </Button>
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="icon"
        className="size-8 rounded-lg"
        onClick={() => setTheme("system")}
      >
        <DesktopIcon />
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="icon"
        className="size-8 rounded-lg"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon />
      </Button>
    </div>
  );
}
