import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Order } from '../../../../shared/models/order.model';
import { OrderService } from '../../services/order.service';
import { OrderFilter } from '../../../../shared/models/order-filter.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LoadingSpinnerComponent,
    NgClass
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filterForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  
  // To store unique countries for the filter dropdown
  countries: string[] = [];
  
  // Used for unsubscribing from observables when component is destroyed
  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      country: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
    this.loadOrders();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Set up listeners for form changes
   */
  private setupFormListeners(): void {
    // Country filter (no debounce needed)
    this.filterForm.get('country')?.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loadOrders());
      
    // Description filter (with debounce)
    this.filterForm.get('description')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300), // Wait 300ms after last keystroke
        distinctUntilChanged() // Only emit if value changed
      )
      .subscribe(() => this.loadOrders());
  }

  /**
   * Load orders with current filters
   */
  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    const filter: OrderFilter = {
      country: this.filterForm.get('country')?.value || undefined,
      description: this.filterForm.get('description')?.value || undefined
    };

    this.orderService.getOrders(filter)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.isLoading = false;
          
          // Extract unique countries for filter dropdown
          this.extractUniqueCountries();
        },
        error: (error) => {
          this.error = error.message || 'Failed to load orders. Please try again.';
          this.isLoading = false;
          console.error('Error loading orders:', error);
        }
      });
  }

  /**
   * Extract unique countries from orders
   */
  private extractUniqueCountries(): void {
    const uniqueCountries = new Set<string>();
    
    this.orders.forEach(order => {
      if (order.country) {
        uniqueCountries.add(order.country);
      }
    });
    
    this.countries = Array.from(uniqueCountries).sort();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterForm.reset();
    this.loadOrders();
  }

  /**
   * Format date for display
   * @param date Date to format
   * @returns Formatted date string
   */
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  /**
   * Format currency for display
   * @param amount Amount
   * @param currency Currency code
   * @returns Formatted currency string
   */
  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
