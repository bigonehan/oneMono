import React from "react";
import {Button} from "@ui/shadcn/components/ui/button"
export type Hero_ttbtProps = {
    title: string;
    description: string;
    buttonLabel: string;
    credit: string;
}

export const Hero_ttbt: React.FC<Hero_ttbtProps> = ({
    title,
    description,
    buttonLabel,
    credit,
}) => {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen text-center text-white bg-background">
            {/* 배경 (옵션: 비디오나 이미지 넣기 가능) */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/your-bg.jpg')] bg-cover bg-center opacity-40" />
            </div>

            {/* 콘텐츠 */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6">
                <h1 className="text-8xl font-bold text-primary tracking-tight leading-tight mb-4">
                    {title}
                </h1>
                <p className="text-lg text-foreground max-w-2xl mb-8">{description}</p>
               

				<Button data-anim="pane" asChild className="w-full sm:w-auto">
                    <a href={"./main"}>{buttonLabel}</a>
                </Button>

                <p className="mt-6 text-sm text-gray-400">{credit}</p>
            </div>
        </section>
    );
};

