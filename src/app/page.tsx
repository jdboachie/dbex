import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DbexIcon, PostgresAltIcon, PostgresIcon } from "@/components/icons";
import { GroupImages } from "@/components/group-images";

export default async function Home() {
  return (
    <main className="dark:bg-landingImageDark bg-landingImageLight">
      <div className="grid grid-cols-5 max-w-6xl mx-auto min-h-screen h-fit">
        {/* <div className="grid grid-cols-5 divide-x border-x max-w-6xl mx-auto min-h-screen h-screen size-full inset-0 z-[-1] fixed">
        <span>{' '}</span>
        <span>{' '}</span>
        <span>{' '}</span>
        <span>{' '}</span>
        <span>{' '}</span>
      </div> */}
        <div className="font-mono tracking-tight text-primary bg-primary-foreground/60 backdrop-blur-md sticky top-2 rounded-full col-span-5 z-50 grid grid-cols-5 place-items-center w-full">
          {/* <Badge variant={'default'} className="rounded-full">alpha stage</Badge> */}
          <Link className="text-center hover:text-primary/60 transition-colors font-light w-full flex justify-center items-center gap-2 p-4" href={'/'}><DbexIcon className="size-6 grayscale" /></Link>
          <Link className="text-center hover:text-primary/60 transition-colors font-light w-full flex justify-center items-center h-full" href={'#team'}>TEAM</Link>
          <Link className="text-center hover:text-primary/60 transition-colors font-light w-full flex justify-center items-center h-full" href={'#contact'}>CONTACT</Link>
          <Link className="text-center hover:text-primary/60 transition-colors font-light w-full flex justify-center items-center h-full" href={'https://github.com/jdboachie/dbex'}>GITHUB</Link>
          <Link className="text-center hover:bg-primary/85 transition-colors font-light w-full flex justify-center items-center h-full bg-primary text-primary-foreground" href={'/app/home'}>DASHBOARD</Link>
        </div>
        <div className="py-24 px-4 place-items-center grid col-span-5 gap-4 max-w-6xl mx-auto w-full">
          <h1 className="brder h-full text-6xl lg:text-8xl font-bold tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 dark:from-neutral-200 via-neutral-950 dark:via-neutral-50 to-neutral-600 dark:to-neutral-700 bg-opacity-50">
            Open Source Dataspace Application
          </h1>
          <p className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-primary via-neutral-500 to-transparent dark:via-neutral-700 text-lg text-center">
            In with Dbex, out with the PGAdmin.
          </p>
          <Link href={'/login'} className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'rounded-full')}>Give it a spin</Link>
        </div>
        <div className="h-[200px]  grid grid-cols-5 col-span-5">
          <div className="grid place-items-center size-full">
            <PostgresAltIcon className="animate-rotate-y size-28 p-4" />
          </div>
          <div className="grid place-items-center size-full">
            <PostgresAltIcon className="animate-rotate-y size-28 p-4" />
          </div>
          <div className="grid place-items-center size-full">
            <PostgresAltIcon className="animate-rotate-y size-28 p-4" />
          </div>
          <div className="grid place-items-center size-full">
            <PostgresAltIcon className="animate-rotate-y size-28 p-4" />
          </div>
          <div className="grid place-items-center size-full">
            <PostgresAltIcon className="animate-rotate-y size-28 p-4" />
          </div>
        </div>
        <div className="text-5xl col-span-5 text-primary py-20 font-semibold text-center">Best in class design and implementation</div>
        <div className="t-[60vh] flex flex-col gap-8 col-span-5 p-10 z-10">
          <Image
            alt="App Screenshot"
            src={'/dbexproject_screenshot_light.png'}
            width={5000}
            height={5000}
            className="hover:shadow-lg dark:hidden flex ring-8 ring-neutral-100 hover:scale-105 animate-all duration-500 rounded-lg"
          />
          <Image
            alt="App Screenshot"
            src={'/dbexproject_screenshot_dark.png'}
            width={50000}
            height={50000}
            className="hover:shadow-lg hidden dark:flex ring-8 ring-neutral-950 hover:scale-105 animate-all duration-500 rounded-lg"
          />
        </div>
        <div className="text-5xl col-span-5 text-primary py-20 font-semibold">Meet the team</div>
        <div className="h-fit p-px col-span-5 gap-5 grid grid-cols-5">
          <GroupImages src={'/elvisgyau.jpg'} alt={'Gyau Boahen Elvis'} />
          <GroupImages src={'/appiahemmanuel.webp'} alt={'Emmanuel Appiah Asiedu'} />
          <GroupImages src={'/david.jpg'} alt={'David Duah'} />
        </div>
        <div className="col-span-5 p-10"> &copy; a groupthirteen project</div>
      </div>
    </main>

  );
}

