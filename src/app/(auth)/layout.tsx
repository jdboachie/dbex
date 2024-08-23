/* "use client"
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
        <div className="max-h-screen min-h-screen w-full lg:grid lg:grid-cols-2">
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
 */


"use client"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { QuoteIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isImageLoad, setIsImageLoad] = useState(false);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    const quotes = [
        {
            text: "DBEX has transformed our data management process with its intuitive design and powerful features. It's a must-have for teams looking to streamline database operations and boost productivity.",
            author: "@gyauelvis"
        },
        {
            text: "Innovative solutions begin with the courage to challenge the status quo. DBEX empowers teams to think outside the box and deliver results that exceed expectations.",
            author: "@Harold Dagadu"
        },
            {
        text: "Effective collaboration is the cornerstone of any successful project. DBEX makes it easier for teams to work together seamlessly, leading to better outcomes.",
        author: "@Jeremiah Adu-Gyamfi"
    },
    {
        text: "In the world of data management, simplicity is the ultimate sophistication. DBEX embodies this principle, making complex tasks simple and efficient.",
        author: "@Leumas Damer"
    },
    {
        text: "DBEX is more than just a tool; it's a catalyst for innovation. It allows us to push the boundaries of what's possible in data management.",
        author: "@Ibiolat Owusu"
    },
    {
        text: "With DBEX, we've turned our data into a strategic asset. Its intuitive design and robust features have made it an essential part of our workflow.",
        author: "@Eugene Gyimah"
    }
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000); // Change quote every 5 seconds

        return () => clearInterval(intervalId);
    }, [quotes.length]);

    return (
        <div className="max-h-screen min-h-screen w-full lg:grid lg:grid-cols-2">
            {children}
            <div className="hidden bg-primary-foreground lg:flex flex-col gap-5 justify-center px-16 text-primary leading-relaxed">
                <div className="text-3xl font-sans relative">
                    <QuoteIcon className="size-20 z-0 absolute -top-12 -left-11 rotate-180 text-secondary"></QuoteIcon>
                    <span className="relative z-20">
                        {quotes[currentQuoteIndex].text}
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
                        />
                        {
                            !isImageLoad && (
                                <Skeleton className="size-10 absolute top-0 rounded-full bg-secondary"></Skeleton>
                            )
                        }
                    </div>
                    <div className="user-name font-mono">
                        {quotes[currentQuoteIndex].author}
                    </div>
                </div>
            </div>
        </div>
    );
}
