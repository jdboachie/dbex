import { PostgresAltIcon } from "@/components/icons";

export default function LoadingUI () {
  return (
    <div className="size-full flex flex-col gap-10 items-center justify-center">
      <PostgresAltIcon className="animate-rotate-y size-32" />
      <p className="text-muted-foreground">Just a moment ...</p>
    </div>
  )
}