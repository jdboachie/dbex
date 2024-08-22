import Image from "next/image"
export const GroupImages = ({ src, alt }: { src: string, alt: string }) => {
    return (
        <div className="rounded-xl backdrop-blur border flex flex-col gap-2 p-2">
            <Image
                src={src}
                width={500}
                height={500}
                alt={alt}
                className="aspect-square border grayscale hover:shadow-lg rounded-lg hover:grayscale-0 duration-1000 ease-out transition-all"
            />
            <div className="p-2">
                <p className="text-base text-primary font-medium">{alt}</p>
            </div>
        </div>
    )
}