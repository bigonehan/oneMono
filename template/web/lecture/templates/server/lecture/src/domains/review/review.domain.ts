export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  content: string;
}

export const reviews: Review[] = [
  { id: 'r1', courseId: 'c1', userId: 'u1', rating: 5, content: '실전 예제가 좋아서 끝까지 수강했습니다.' },
  { id: 'r2', courseId: 'c2', userId: 'u1', rating: 4, content: '기초 개념을 빠르게 정리하기 좋습니다.' }
];
