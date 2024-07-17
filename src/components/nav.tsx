"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { HomeIcon, ServerIcon, TerminalWindowIcon } from './icons';

const Nav = ({ isCollapsed } : { isCollapsed : boolean }) => {

  const pathname = usePathname()

  interface LinkInterface {
    title: string,
    label: string,
    icon: any,
    href?: string,
  }


  const links: LinkInterface[] = [
    {
      title: "Home",
      label: "",
      icon: HomeIcon,
      href: '/app/home',
    }
    ,
    {
      title: "Connections",
      label: "",
      icon: ServerIcon,
      href: '/app/connections',
    },
    {
      title: "SQL Editor",
      label: "",
      icon: TerminalWindowIcon,
      href: '/app/queries',
    },
  ]

  return (
    // fix repeated code pathname.startsWith(link.href || 'undefined')
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-2 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href || '#'}
                  className={cn(
                    buttonVariants({ variant: pathname.startsWith(link.href || 'undefined') ? 'default': 'ghost', size: "icon" }),
                    "size-10",
                    pathname.startsWith(link.href || 'undefined') ?
                      "dark:bg-muted dark:hover:bg-muted dark:hover:text-white dark:text-primary" : "text-muted-foreground"
                  )}
                >
                  <link.icon className="size-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                <TooltipArrow />
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href || '#'}
              className={cn(
                buttonVariants({ variant: pathname.startsWith(link.href || 'undefined') ? 'default': 'ghost', size: "lg" }),
                'px-3',
                pathname.startsWith(link.href || 'undefined') &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
                !pathname.startsWith(link.href || 'undefined') &&
                "text-primary/70"
              )}
            >
              <link.icon className="mr-2 size-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
};

export default Nav;
