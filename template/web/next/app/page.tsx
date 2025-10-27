"use client";

import { useCallback } from "react";

import { Enterance } from "@ui/shadcn/components/section/Enterance";
import { BasicSection } from "@ui/shadcn/components/section/BasicSection";
import { VideoBackgroundSection } from "@ui/shadcn/components/section/VideoBackgroundSection";
import { Button } from "@ui/shadcn/components/ui/button";
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { mockPosts } from "@src/mocks/posts";
import Lenis from 'lenis'
import dynamic from "next/dynamic";
import SmoothScroll  from "@src/components/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
	return (
        <main className="min-h-screen bg-background text-foreground">
			   <SmoothScroll />
            <Enterance
                title="Landing Animation Playground"
                description="스크롤 이벤트와 애니메이션 레지스트리가 제대로 연결되었는지 확인하세요. 아래로 스크롤하면 각 섹션이 부드럽게 등장합니다."
                buttonLabel="애니메이션 확인하기"
                onButtonClick={() => console.log("Enterance button clicked")}
            />
            <VideoBackgroundSection
                src="https://storage.googleapis.com/coverr-main/mp4/coverr-waves.mp4"
                poster="https://storage.googleapis.com/coverr-main/posters/coverr-waves.jpg"
                className="text-white"
                contentClassName="max-w-3xl items-start"
            >
                <span className="text-sm font-semibold tracking-wide text-primary-foreground/80">
                    Immersive Background
                </span>
                <h2 className="text-4xl font-bold sm:text-5xl">
                    영상 배경 위에서 CTA를 배치하며 대비를 테스트하세요.
                </h2>
                <p className="text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
                    Gradient overlay가 적용된 상태에서도 텍스트와 버튼이 선명하게 보이는지,
                    다양한 인터랙션 컴포넌트가 배경 영상 위에서 어떤 대비를 가지는지 확인할 수
                    있습니다.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <Button size="lg" className="bg-white/90 text-primary hover:bg-white">
                        CTA 살펴보기
                    </Button>
                    <Button
                        variant="ghost"
                        className="border border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20"
                    >
                        Secondary Action
                    </Button>
                </div>
            </VideoBackgroundSection>


            <section className="border-t border-border/40 bg-muted/30">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
                    <header className="space-y-3">
                        <p className="text-sm uppercase tracking-widest text-muted-foreground">
                            Board Preview
                        </p>
                        <h2 className="text-2xl font-semibold">
                            Mock Posts powered by Effect brands
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            게시글 도메인을 UI에 렌더링해 Effect 브랜드 타입이 올바르게
                            적용되는지 확인합니다.
                        </p>
                    </header>
                    <div className="grid gap-4">
                        {mockPosts.map((post) => (
                            <article
                                key={post.id}
                                className="rounded-lg border border-border/40 bg-background/80 p-6 shadow-sm transition hover:border-border hover:shadow-md"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                                    <span>{post.user.name}</span>
                                    <time dateTime={post.createdAt.toISOString()}>
                                        {post.createdAt.toLocaleString()}
                                    </time>
                                </div>
                                <h3 className="mt-3 text-lg font-semibold">{post.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {post.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
