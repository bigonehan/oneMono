

import { FeatureList } from "@/src/content/FeatureContent";
import SmoothScroll from "@src/components/SmoothScroll";
import { FeatureListSection } from "@ui/shadcn/components/section/FeatureListSection";
import { VideoBackgroundSection } from "@ui/shadcn/components/section/VideoBackgroundSection";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <SmoothScroll />
            <VideoBackgroundSection
                src="https://rdmueoyidhachtpnopac.supabase.co/storage/v1/object/public/Public/output.mp4"
                className="relative min-h-screen flex items-center justify-center text-center"
                overlayClassName="from-black/50 via-black/30 to-transparent"
                contentClassName="flex flex-col items-center justify-center gap-4 max-w-md w-full mx-auto text-white"
            >
                <h1 className="text-6xl font-bold text-[#ff2f72]">leum</h1>
                <p className="text-lg text-white/80">즐거움을 함께</p>

                <button className="mt-4 px-6 py-2 rounded-full bg-[#ff2f72] hover:bg-[#e62a65] text-white text-base transition">
                    알아보기
                </button>

                <p className="mt-2 text-sm text-white/60">beta</p>
            </VideoBackgroundSection>
			     <FeatureListSection
                eyebrow=""
                title="꾸준히 즐기는 두뇌 훈련"
                description="이음의 다섯 가지 코어 기능으로 기억력부터 집중력, 휴식까지 균형 있게 채워보세요."
                features={FeatureList}
            />
			
        </main>
    );
}
