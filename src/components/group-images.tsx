import Image from "next/image"
export const GroupImages = ({ src, alt }: { src: string, alt: string }) => {
    return (
        <Image
            src={src}
            width={500}
            height={500}
            alt={alt}
            className="aspect-square grayscale hover:grayscale-0 duration-1000 ease-out transition-all"
        />
    )
}