"use client";

import { useCallback } from "react";

import {
  ScrollSections,
  type ScrollSectionEnterPayload,
} from "@ui/gsap/scroll";
import { Enterance } from "@ui/shadcn/section/Enterance";
import { BasicSection } from "@ui/shadcn/section/BasicSection";

const sections = [
  {
    title: "Section 1",
    description:
      "GSAP 애니메이션과 스크롤 트리거가 올바르게 실행되는지 확인하는 첫 번째 구간입니다.",
    color: "bg-sky-50",
  },
  {
    title: "Section 2",
    description:
      "각 섹션이 뷰포트에 들어오면 페이드 인 애니메이션과 함께 텍스트가 나타납니다.",
    color: "bg-emerald-50",
  },
  {
    title: "Section 3",
    description:
      "투명도가 0에서 시작하여 서서히 드러나는 효과가 모든 섹션에 공통으로 적용됩니다.",
    color: "bg-amber-50",
  },
  {
    title: "Section 4",
    description:
      "색상과 카피를 다양하게 조합해 스크롤 스냅과 애니메이션을 검증할 수 있습니다.",
    color: "bg-violet-50",
  },
  {
    title: "Section 5",
    description:
      "마지막 섹션까지 애니메이션이 유지되는지 콘솔 로그와 함께 살펴보세요.",
    color: "bg-rose-50",
  },
];

export default function Home() {
  const handleSectionEnter = useCallback(
    ({ index }: ScrollSectionEnterPayload) => {
      console.log(`section ${index + 1}`);
    },
    [],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ScrollSections
        className="flex flex-col"
        defaultAnimation="showFromZeroAlpha"
        onSectionEnter={handleSectionEnter}
      >
        <Enterance
          title="Landing Animation Playground"
          description="스크롤 이벤트와 애니메이션 레지스트리가 제대로 연결되었는지 확인하세요. 아래로 스크롤하면 각 섹션이 부드럽게 등장합니다."
          buttonLabel="애니메이션 확인하기"
          onButtonClick={() => console.log("Enterance button clicked")}
        />
        {sections.map((section) => (
          <BasicSection key={section.title} {...section} />
        ))}
      </ScrollSections>
    </main>
  );
}
