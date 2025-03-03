import { Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

export const ORDERS_ROUTES: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'create', component: CreateOrderComponent }
];
