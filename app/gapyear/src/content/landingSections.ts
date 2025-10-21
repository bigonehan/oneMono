import type { Testimonialprop } from "@ui/shadcn/components/section/Testimonial_1";

export const heroContent = {
    header: "기억은 지켜야 할 이야기입니다.",
    subheader: "매일 10분, 두뇌를 깨우는 치매 예방 습관",
    description: "이음 – 당신의 기억을 잇다",
    primaryCta: {
        label: "지금 시작하기",
        href: "#download",
    },
    secondaryCta: {
        label: "앱 다운로드",
        href: "#app",
    },
};

export const problemAwarenessContent = {
    title: "치매, 예방이 가장 좋은 치료입니다.",
    description:
        "노년층의 70% 이상이 기억력 저하를 경험하지만, 규칙적인 인지훈련만으로 발병 위험을 낮출 수 있다는 사실, 알고 계셨나요?",
};

export const scientificProofContent = {
    eyebrow: "과학적 근거",
    title: "신경심리학 전문가와 함께 설계된 인지 훈련 알고리즘",
    description: [
        "실제 연구에서 입증된 '두뇌 가소성(Brain Plasticity)' 원리를 기반으로 합니다.",
    ],
    highlights: [
        {
            title: "○○대 병원 협력 연구 진행 중",
        },
        {
            title: "국가 R&D 과제 선정",
        },
    ],
};

export const appHighlightsContent = {
    eyebrow: "이음 앱",
    title: "쉽고, 따뜻하게, 매일 두뇌 운동",
    description: [] as string[],
    highlights: [
        {
            title: "손쉬운 인터페이스",
            description: "큰 글씨와 명확한 색 대비로 부모님도 부담 없이 사용합니다.",
        },
        {
            title: "가족 계정 연동",
            description: "가족 계정으로 부모님의 훈련 현황을 함께 살펴보세요.",
        },
        {
            title: "꾸준함을 위한 푸시 알림",
            description: "맞춤형 리마인더로 매일의 10분 습관을 돕습니다.",
        },
    ],
};

export const testimonials: Testimonialprop[] = [
    {
        content: "하루 10분씩 하니까 머리가 맑아지는 느낌이에요.",
        author: "김은정",
        role: "65세, 강남구",
    },
    {
        content: "부모님이 매일 재미있게 퀴즈를 푸세요.",
        author: "박도윤",
        role: "보호자",
    },
    {
        content: "병원 검사 전보다 인지 점수가 올랐어요!",
        author: "이서진",
        role: "재활센터 코치",
    },
];

export const finalCtaContent = {
    title: "기억을 잇는 하루 10분",
    description: "당신의 두뇌 건강, 지금부터 시작하세요.",
    primary: {
        label: "앱 다운로드",
        href: "#app",
    },
    secondary: {
        label: "무료 체험 시작",
        href: "#trial",
    },
};
