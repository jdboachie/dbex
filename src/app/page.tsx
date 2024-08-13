import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function Home () {
  return (
    <div className="grid grid-cols-4 py-24 max-w-6xl mx-auto min-h-screen h-fit">
      <div className="fixed place-items-center grid col-span-4 p-4 gap-4 max-w-6xl mx-auto w-full pt-20 md:pt-0">
        <Badge variant={'outline'} className="rounded-full font-normal font-mono">alpha stage</Badge>
        <h1 className="text-6xl lg:text-8xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 dark:from-neutral-400 via-amber-950 dark:via-amber-100 to-neutral-500 dark:to-neutral-700 bg-opacity-50 pb-2">
          Open Source Dataspace Application
        </h1>
        <p className="font-normal text-base text-neutral-700 dark:text-neutral-200 max-w-lg text-center mx-auto">
          Overkill? <span className="italic">Think again</span>.
        </p>
        <Link href={'/login'} className={cn(buttonVariants({variant: 'default', size: 'lg'}), 'rounded-full')}>Give it a spin</Link>
      </div>
      <div className="mt-[60vh] col-span-4 z-10">
        <Image
          alt="App Screenshot"
          src={'/dbexproject_screenshot_light.png'}
          width={5000}
          height={5000}
          className="dark:hidden border rounded-lg hover:border-ring animate-all"
        />
        <Image
          alt="App Screenshot"
          src={'/dbexproject_screenshot_dark.png'}
          width={50000}
          height={50000}
          className="hidden dark:flex border hover:border-border-2 hover:border-amber-500 hover:scale-[1.01] animate-all duration-500 rounded-lg"
        />
      </div>
      <div className="col-span-4"> &copy; a groupthirteen project</div>
    </div>
  );
}

