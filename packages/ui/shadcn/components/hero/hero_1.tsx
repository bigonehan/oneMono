
import { cn } from "../../lib/utils"
import { buttonVariants } from "@ui/shadcn/ui/button"


export type HeroConfig = {
    header: string;
    subheader: string;
    ctaText: string;
    ctaLink: string;
    image: string;
};

interface HeroHeaderProps {
    config: HeroConfig;
    ctaButton?: React.ReactNode; // optional - 커스텀 버튼 가능
    heroImage?: React.ReactNode; // optional - 커스텀 이미지 가능
}

export default function HeroHeader({ config, ctaButton, heroImage }: HeroHeaderProps) {
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
                {ctaButton}
            </div>
            {heroImage && (
                <div className="flex flex-1 justify-center lg:justify-end">
                    {heroImage}
                </div>
            )}
        </section>
    )
}
