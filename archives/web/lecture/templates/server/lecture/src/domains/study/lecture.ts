export interface LectureItem {
  id: string;
  courseId: string;
  title: string;
  durationSec: number;
}

export const lectures: LectureItem[] = [
  { id: 'l1', courseId: 'c1', title: 'Relay 기본 구조', durationSec: 1200 },
  { id: 'l2', courseId: 'c1', title: 'Cursor Pagination', durationSec: 1500 },
  { id: 'l3', courseId: 'c2', title: 'Astro SSR', durationSec: 1100 }
];
