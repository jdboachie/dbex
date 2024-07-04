"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  House as HomeIcon,
  Chat as ChatIcon,
  GearFine as GearIcon,
  HardDrives as ConnectionsIcon,
  ListMagnifyingGlass as ListMagnifyingGlassIcon,
} from "@phosphor-icons/react"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

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
      label: "3",
      icon: ConnectionsIcon,
      href: '/app/connections',
    },
    {
      title: "Queries",
      label: "12",
      icon: ListMagnifyingGlassIcon,
      href: '/app/queries',
    },
  ]

  const secondaryLinks: LinkInterface[] = [
    {
      title: "Settings",
      label: "",
      icon: GearIcon,
    },
    {
      title: "Feedback",
      label: "",
      icon: ChatIcon,
    }
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
                    "h-9 w-9",
                    pathname.startsWith(link.href || 'undefined') ?
                      "dark:bg-muted dark:hover:bg-muted dark:hover:text-white" : "text-muted-foreground"
                  )}
                >
                  <link.icon className="size-5" />
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
                buttonVariants({ variant: pathname.startsWith(link.href || 'undefined') ? 'default': 'ghost', size: "default" }),
                pathname.startsWith(link.href || 'undefined') &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
                !pathname.startsWith(link.href || 'undefined') &&
                "text-primary/70"
              )}
            >
              <link.icon size={16} className="mr-2 size-5" />
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
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {secondaryLinks.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger>
                    <Button
                      size={'icon'}
                      variant={pathname.startsWith(link.href || 'undefined') ? 'default' : 'ghost'}
                      className={cn(
                        pathname.startsWith(link.href || 'undefined') ?
                          "dark:bg-muted dark:hover:bg-muted dark:hover:text-white" : "text-muted-foreground"
                      )}
                    >
                      <link.icon className="size-5" />
                      <span className="sr-only">{link.title}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
            <Dialog
              key={index}
              >
              <DialogTrigger>
                <Button
                  variant={pathname.startsWith(link.href || 'undefined') ? 'default' : 'ghost'}
                  className={cn(
                    "justify-start w-full",
                    pathname.startsWith(link.href || 'undefined') ?
                      "dark:bg-muted dark:hover:bg-muted dark:hover:text-white" : "text-muted-foreground"
                  )}
                >
                  <link.icon className="mr-2 size-5" />
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
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ),
        )}
        </nav>
    </div>
  );
};

export default Nav;
