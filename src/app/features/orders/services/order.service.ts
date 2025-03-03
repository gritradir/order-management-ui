import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateOrderDto } from '../../../shared/models/create-order.model';
import { Order } from '../../../shared/models/order.model';
import { OrderFilter } from '../../../shared/models/order-filter.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = 'orders';

  constructor(private apiService: ApiService) {}

  /**
   * Create a new order
   * @param orderData Order creation data
   * @returns Observable with created order
   */
  createOrder(orderData: CreateOrderDto): Observable<Order> {
    return this.apiService.post<Order>(this.endpoint, orderData);
  }

  /**
   * Get all orders with optional filtering
   * @param filter Optional filter criteria
   * @returns Observable with array of orders
   */
  getOrders(filter: OrderFilter = {}): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.endpoint, filter)
      .pipe(
        map(orders => this.transformOrderDates(orders))
      );
  }

  /**
   * Get order by unique ID
   * @param uniqueId Order unique ID
   * @returns Observable with order data
   */
  getOrderByUniqueId(uniqueId: string): Observable<Order> {
    return this.apiService.get<Order>(`${this.endpoint}/unique/${uniqueId}`)
      .pipe(
        map(order => this.transformOrderDate(order))
      );
  }

  /**
   * Get order by order number
   * @param orderNumber Order number
   * @returns Observable with order data
   */
  getOrderByOrderNumber(orderNumber: string): Observable<Order> {
    return this.apiService.get<Order>(`${this.endpoint}/number/${orderNumber}`)
      .pipe(
        map(order => this.transformOrderDate(order))
      );
  }

  /**
   * Transform date strings to Date objects in an array of orders
   * @param orders Array of orders
   * @returns Transformed orders
   */
  private transformOrderDates(orders: Order[]): Order[] {
    return orders.map(order => this.transformOrderDate(order));
  }

  /**
   * Transform date strings to Date objects in an order
   * @param order Order object
   * @returns Transformed order
   */
  private transformOrderDate(order: Order): Order {
    return {
      ...order,
      paymentDueDate: new Date(order.paymentDueDate),
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    };
  }
}
