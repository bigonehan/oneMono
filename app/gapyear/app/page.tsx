"use client";
import Image from "next/image";

import { Hero_1 } from "@ui/shadcn/hero/hero_1";
import { Button } from "@ui/shadcn/ui/button";
import { Testimonial_1 } from "@ui/shadcn/section/Testimonial_1";
import { Feature_2 } from "@ui/shadcn/section/Feature_2";
import { FeatureContentData } from "@src/content/FeatureContent";
import testimonialsData from "@src/content/testmonials";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div>
                <Hero_1
                    header="이음"
                    subheader="즐거움을 되찾는 방법 "
                    ctaButton={
                        <Button size="lg" onClick={() => alert("main")}>
                            알아보기 
                        </Button>
                    }
                    heroImage={
                        <Image
                            src="/globe.svg"
                            alt="Hero Image"
                            width={500}
                            height={400}
                            className="rounded-2xl shadow-lg"
                        />
                    }
                />
                <Feature_2 features={FeatureContentData} />

            </div>
        </main>
    );
}
