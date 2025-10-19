import { Featureprop } from "@ui/shadcn/components/section/Feature_2.jsx";
export const ExampleFeatureData: Featureprop[] =[
        {
            id: "feature-1",
            icon: (
                <svg width="24" height="24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            ),
            heading: "AI 기반 자동화",
            description: "반복적인 작업을 자동으로 처리하여 효율성을 극대화합니다.",
            image: "/images/automation.png",
            url: "/features/automation",
            isDefault: true,
        },
        {
            id: "feature-2",
            icon: (
                <svg width="24" height="24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" />
                </svg>
            ),
            heading: "데이터 분석",
            description: "고급 분석 도구로 데이터를 시각화하고 인사이트를 제공합니다.",
            image: "/images/analytics.png",
            url: "/features/analytics",
            isDefault: false,
        },
        {
            id: "feature-3",
            icon: (
                <svg width="24" height="24" fill="currentColor">
                    <polygon points="12,2 22,22 2,22" />
                </svg>
            ),
            heading: "보안 관리",
            description: "최신 보안 기술로 데이터와 시스템을 안전하게 보호합니다.",
            image: "/images/security.png",
            url: "/features/security",
            isDefault: false,
        },
    ];

