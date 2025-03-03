import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderService } from './services/order.service';


const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'create', component: CreateOrderComponent }
];

@NgModule({
  declarations: [
    OrderListComponent,
    CreateOrderComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    OrderService
  ]
})
export class OrdersModule { }
