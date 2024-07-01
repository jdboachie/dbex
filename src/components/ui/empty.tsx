import { cn } from "@/lib/utils"

function Empty({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pule rounded-md bg-primary/5", className)}
      {...props}
    />
  )
}

export { Empty }
