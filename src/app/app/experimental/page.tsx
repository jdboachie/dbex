import { ResizablePanel } from "@/components/ui/resizable";
import { TableCellsIcon } from '@heroicons/react/16/solid'

export default function Page () {
  return (
    <ResizablePanel defaultSize={85} className="border rounded-xl p-4 bg-background">
      <div className="bg-primary-foreground p-1 flex gap-2 items-center px-2 rounded-sm">
        <TableCellsIcon className='size-5' />
        <span className='flex items-center gap-4'>
          <p className="text-muted-foreground text-sm">Schema </p><p className="font-mono tracking-tighter">databaseName</p>
        </span>
      </div>
    </ResizablePanel>
  )
}