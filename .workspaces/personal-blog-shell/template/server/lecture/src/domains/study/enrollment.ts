export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: 'active' | 'completed';
}

export const enrollments: Enrollment[] = [
  { id: 'e1', courseId: 'c1', userId: 'u1', status: 'active' },
  { id: 'e2', courseId: 'c2', userId: 'u1', status: 'completed' }
];
