export interface Progress {
  id: string;
  enrollmentId: string;
  percent: number;
}

export const progresses: Progress[] = [
  { id: 'p1', enrollmentId: 'e1', percent: 45 },
  { id: 'p2', enrollmentId: 'e2', percent: 100 }
];
