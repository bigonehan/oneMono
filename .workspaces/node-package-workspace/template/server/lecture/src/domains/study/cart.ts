export interface CartItem {
  id: string;
  userId: string;
  courseId: string;
}

export const cartItems: CartItem[] = [{ id: 'cart1', userId: 'u1', courseId: 'c1' }];
