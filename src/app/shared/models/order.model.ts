export interface Order {
  id: string;
  orderNumber: string;
  uniqueId: string;
  paymentDescription: string;
  streetAddress: string;
  town: string;
  country: string;
  amount: number;
  currency: string;
  paymentDueDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}