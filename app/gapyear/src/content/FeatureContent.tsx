import { Featureprop } from "@ui/shadcn/components/section/Feature_2.jsx";
export const FeatureContentData: Featureprop[] = [

    {
        id: "feature-1",
        icon: (
            <svg width="24" height="24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
        heading: "두뇌 활성 미니게임",
        description:
            "단어 맞추기, 숫자 기억하기 등 재미있는 게임을 통해 자연스럽게 인지 능력을 유지합니다.",
        image: "/images/brain_game.png",
        url: "/features/brain-games",
        isDefault: true,
    },
    {
        id: "feature-2",
        icon: (
            <svg width="24" height="24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" />
            </svg>
        ),
        heading: "언어 · 수리 훈련",
        description:
            "단어 연상, 계산 퀴즈 등 다양한 훈련으로 기억력과 집중력을 향상시킵니다.",
        image: "/images/language_math.png",
        url: "/features/language-math",
        isDefault: false,
    },
    {
        id: "feature-3",
        icon: (
            <svg width="24" height="24" fill="currentColor">
                <polygon points="12,2 22,22 2,22" />
            </svg>
        ),
        heading: "AI 맞춤 분석",
        description:
            "AI가 게임 기록을 분석하여 개인별 인지 상태를 파악하고 맞춤형 훈련을 제안합니다.",
        image: "/images/ai_analysis.png",
        url: "/features/ai-analysis",
        isDefault: false,
    },
    {
        id: "feature-4",
        icon: (
            <svg width="24" height="24" fill="currentColor">
                <path d="M12 2L2 7v6c0 5.5 5 10 10 10s10-4.5 10-10V7z" />
            </svg>
        ),
        heading: "감정 케어 기록",
        description:
            "매일의 기분과 감정을 기록하며 마음의 변화를 함께 관리할 수 있습니다.",
        image: "/images/emotion_care.png",
        url: "/features/emotion-care",
        isDefault: false,
    },
];

