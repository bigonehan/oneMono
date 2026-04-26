export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
}

export const coupons: Coupon[] = [{ id: 'cp1', code: 'WELCOME10', discountPercent: 10 }];
