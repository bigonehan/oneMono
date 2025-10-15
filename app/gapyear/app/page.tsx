'use client'
import Image from "next/image";

import { Hero_1 } from "@ui/shadcn/hero/hero_1";
import { Button } from "@ui/shadcn/ui/button";
improt {Feature_2} from "@ui/shadcn/section/feature_2"
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>

                <Hero_1
                    header="세상을 바꾸는 아이디어"
                    subheader="우리의 기술로 더 나은 내일을 만듭니다"
                    ctaButton={
                        <Button size="lg" onClick={() => alert("시작하기 클릭!")}>
                            시작하기
                        </Button>
                    }
                    heroImage={
                        <Image
                            src="/images/hero-image.png"
                            alt="Hero Image"
                            width={500}
                            height={400}
                            className="rounded-2xl shadow-lg"
                        />
                    }
                />
				<Feature_2/>
            </div>
        </main>
    );
}
