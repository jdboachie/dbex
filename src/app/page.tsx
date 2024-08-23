import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DbexIcon, PostgresAltIcon } from "@/components/icons";
import { GroupImages } from "@/components/group-images";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

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
        <div className="border w-fit lgw-1/2 mx-auto p-1 tracking-tigt text-primary text-xs bg-primary-foreground/60 backdrop-blur-md sticky top-4 rounded-full col-span-5 z-50 flex place-items-center">
          {/* <Badge variant={'default'} className="rounded-full">alpha stage</Badge> */}
          <Link className={cn(buttonVariants({variant: 'ghost'}), "rounded-full transition-all duration-700")} href={'/'}><DbexIcon className="size-5 grayscale" /></Link>
          <Link className={cn(buttonVariants({variant: 'ghost'}), "rounded-full transition-all duration-700")} href={'https://github.com/jdboachie/dbex'}><GitHubLogoIcon className="size-5" /></Link>
          <Link className={cn(buttonVariants({variant: 'ghost'}), "rounded-full transition-all duration-700 bg-transparent hover:shadow-xl hover:shadow-white/10")} href={'#team'}>Team</Link>
          <Link className={cn(buttonVariants({variant: 'ghost'}), "rounded-full transition-all duration-700")} href={'#contact'}>Contact</Link>
          <Link className={cn(buttonVariants({variant: 'outline'}), "rounded-full transition-all duration-700")} href={'/app/home'}>Dashboard</Link>
        </div>
        <div className="py-24 px-4 place-items-center grid col-span-5 gap-4 max-w-6xl mx-auto w-full">
          <h1 className="brder h-full text-6xl lg:text-8xl font-bold tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 dark:from-neutral-200 via-neutral-950 dark:via-neutral-50 to-neutral-600 dark:to-neutral-700 bg-opacity-50">
            Open Source Dataspace Application
          </h1>
          <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-neutral-500 to-transparent dark:via-neutral-700 text-lg text-center">
            In with Dbex, out with the PGAdmin.
          </p>
          <Link href={'/app/home'} className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'rounded-full')}>Give it a spin</Link>
        </div>
        <div className="h-[200px] grid grid-cols-5 col-span-5">
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
        <div className="text-5xl col-span-5 text-primary py-20 text-center font-semibold">Meet the team</div>
        <div id="team" className="p-2 col-span-5 w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 overflow-hidden">
          <GroupImages src={'/elvisgyau.jpg'} alt={'Gyau Boahen Elvis'} />
          <GroupImages src={'/appiahemmanuel.webp'} alt={'Emmanuel Appiah Asiedu'} />
          <GroupImages src={'/akitaeyram.jpg'} alt={'Akita Eyram Priscilla'} />
          <GroupImages src={'/david.jpg'} alt={'David Duah'} />
          <GroupImages src={'/niilartey.jpg'} alt={'Nii Lartey'} />
          <GroupImages src={'/dagaduharold.jpg'} alt={'Dagadu Harold Kekeli'} />
          <GroupImages src={'/sarkodie.jpg'} alt={'Emmanuel Sarkodie'} />
          <GroupImages src={'/jude-boachie.jpg'} alt={'Jude Boachie'} />
          <GroupImages src={'/eugenekofigyimah.jpg'} alt={'Eugene Kofi Gyimah'} />
        </div>
        <div className="col-span-5 p-10"> &copy; a groupthirteen project</div>
      </div>
    </main>

  );
}

