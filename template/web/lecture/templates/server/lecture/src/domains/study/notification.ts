export interface Notification {
  id: string;
  userId: string;
  message: string;
}

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u1', message: '새 강의 업데이트가 등록되었습니다.' }
];
