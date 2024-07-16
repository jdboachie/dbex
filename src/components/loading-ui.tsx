import { PostgresAltIcon } from "@/components/icons";
import { Separator } from "./ui/separator";

export default function LoadingUI () {
  return (
    <div className="size-full flex flex-col gap-10 items-center justify-center">
      <PostgresAltIcon className="animate-rotate-y size-24 " />
      <p className="text-muted-foreground text-sm font-mono tracking-tight">Just a moment ...</p>
    </div>
  )
}