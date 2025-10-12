import Link from "next/link"
import Image from "next/image"
import { cn } from "../../lib/utils"
import { buttonVariants } from "@ui/shadcn/ui/button"
import { heroHeader } from "@/config/contents"

export type HeroConfig = {
    header: string; // 메인 헤더 텍스트
    subheader: string; // 서브 헤더 텍스트
    image: string; // 이미지 파일 경로 (예: `/hero-img.webp`)
    ctaLink: string; // "Get started" 버튼의 링크
    ctaText: string; // "Get started" 버튼의 텍스트
};
interface HeroHeaderProps {
    config: HeroConfig;
}

// config를 props로 받도록 수정
export default function HeroHeader({ config }: HeroHeaderProps) {
    return (
        <section className="container flex flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
            <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold lg:text-6xl">
                        {config.header}
                    </h1>
                    <h2 className="text-lg font-light text-muted-foreground lg:text-3xl">
                        {config.subheader}
                    </h2>
                </div>
                <Link
                    href={config.ctaLink}
                    target="_blank"
                    className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
                >
                    {config.ctaText}
                </Link>
            </div>
            {config.image !== "" ? (
                <div className="flex flex-1 justify-center lg:justify-end">
                    <Image
                        src={config.image}
                        width={500}
                        height={500}
                        alt="Header image"
                    />
                </div>
            ) : (
                <></>
            )}
        </section>
    )
}


