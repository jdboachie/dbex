import { Spotlight } from "@/components/ui/spotlight";

export default async function Home () {
  return (
    <div className="h-screen w-screen font-sans flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 pb-2">
          We&apos;re cooking <br /> something stunning.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Expect tasty code. Code that sizzles. A stunning new software. Get ready for a byte of <span className="italic">wow</span>.
        </p>
      </div>
    </div>
  );
}

