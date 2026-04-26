export type PaymentStatus = 'ready' | 'paid' | 'failed';

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: PaymentStatus;
}

export const payments: Payment[] = [
  { id: 'pay1', userId: 'u1', courseId: 'c1', amount: 99000, status: 'paid' },
  { id: 'pay2', userId: 'u1', courseId: 'c2', amount: 79000, status: 'ready' }
];
