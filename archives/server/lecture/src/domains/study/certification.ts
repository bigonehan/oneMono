export interface Certification {
  id: string;
  userId: string;
  courseId: string;
  verifyUrl: string;
}

export const certifications: Certification[] = [
  { id: 'cert1', userId: 'u1', courseId: 'c2', verifyUrl: '/verify/uuid-cert1' }
];
