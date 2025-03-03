export interface CreateOrderDto {
  orderNumber: string;
  paymentDescription: string;
  streetAddress: string;
  town: string;
  country: string;
  amount: number;
  currency: string;
  paymentDueDate: string;
}
