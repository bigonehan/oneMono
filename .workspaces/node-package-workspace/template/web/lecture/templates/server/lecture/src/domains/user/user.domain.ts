export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const users: User[] = [
  { id: 'u1', name: 'Lee Student', email: 'student@lecture.dev', role: 'student' },
  { id: 'u2', name: 'Kim Instructor', email: 'instructor@lecture.dev', role: 'instructor' },
  { id: 'u3', name: 'Park Admin', email: 'admin@lecture.dev', role: 'admin' }
];
