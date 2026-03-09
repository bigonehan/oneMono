export type SeedDocument = {
  id: string;
  title: string;
  fileName: string;
  description: string;
  tags: string[];
  content: string;
};

export const SEED_DOCUMENTS: SeedDocument[] = [
  {
    id: 'nation-song',
    title: '애국가',
    fileName: 'nation_song.md',
    description: '대한민국 대표 노랫말을 짧은 소개와 함께 리더 화면에서 천천히 읽을 수 있습니다.',
    tags: ['anthem', 'classic', 'korean'],
    content: `# 애국가

대한민국을 상징하는 노랫말입니다.

## 1절

동해물과 백두산이 마르고 닳도록
하느님이 보우하사 우리나라 만세
무궁화 삼천리 화려 강산
대한 사람 대한으로 길이 보전하세

## 읽기 포인트

- 짧은 문장을 천천히 읽는 리듬을 확인하기 좋습니다.
- 설정 화면에서 속도와 글자 크기를 조절하며 차이를 볼 수 있습니다.
`
  },
  {
    id: 'moonlight-walk',
    title: 'Moonlight Walk',
    fileName: 'moonlight_walk.md',
    description: '밤 산책을 테마로 한 짧은 수필입니다. 문단 간 호흡과 서정적인 표현을 확인하기 좋습니다.',
    tags: ['essay', 'night', 'calm'],
    content: `# Moonlight Walk

고요한 밤길을 따라 천천히 걷는 장면을 담은 짧은 수필입니다.

## Scene

The street lamps were dim, but the moon made the sidewalk feel almost silver.
Every few steps, the air changed. It carried a little grass, a little dust,
and the distant sound of traffic that never fully disappeared.

## Why it works in a reader

1. Short paragraphs create a clear pacing rhythm.
2. The markdown headings split the mood into scenes.
3. Readers can test smaller or larger font settings without losing structure.
`
  },
  {
    id: 'reading-routine',
    title: 'Reading Routine',
    fileName: 'reading_routine.md',
    description: '매일 10분 읽기 습관을 만드는 가이드를 markdown 형식으로 정리한 문서입니다.',
    tags: ['guide', 'habit', 'routine'],
    content: `# Reading Routine

매일 같은 시간에 10분씩 읽는 습관은 긴 문서도 부담 없이 시작하게 만듭니다.

## Recommended flow

- Choose one document.
- Read for ten focused minutes.
- Pause and note one sentence that remained in memory.
- Continue tomorrow from the same subject.

## Small checklist

- [x] 문서 하나만 고르기
- [x] 알림 끄기
- [x] 속도와 폰트 크기 맞추기
- [x] 끝까지 읽지 않아도 중단 지점 기록하기
`
  }
];
