"use client"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { QuoteIcon } from "@radix-ui/react-icons"
import { useState } from "react";


export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isImageLoad, setIsImageLoad] = useState(false);
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            {children}
            <div className="hidden bg-primary-foreground lg:flex flex-col gap-5 justify-center px-16 text-primary leading-relaxed">

                <div className="text-3xl font-sans relative">
                    <QuoteIcon className="size-20 z-0 absolute -top-12 -left-11 rotate-180 text-secondary"></QuoteIcon>
                    <span className="relative z-20">
                        DBEX has transformed our data management process with its intuitive design and powerful features.
                        It&aposs a must-have for teams looking to streamline database operations and boost productivity.
                    </span>

                </div>
                <div className="flex gap-2 items-center text-muted-foreground font-bold relative">
                    <div className="avatar">
                        <Image
                            src={'/avataaars.svg'}
                            alt=""
                            width={10}
                            height={10}
                            className={`size-10 rounded-full bg-secondary ${isImageLoad ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setIsImageLoad(true)}
                        >
                        </Image>
                        {
                            !isImageLoad && (
                                <Skeleton className="size-10 absolute top-0 rounded-full bg-secondary"></Skeleton>
                            )
                        }
                    </div>
                    <div className="user-name font-mono">
                        @gyauelvis
                    </div>
                </div>
            </div>
        </div>
    )
}
