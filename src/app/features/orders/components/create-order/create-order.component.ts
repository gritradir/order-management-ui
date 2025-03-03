import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule, NgClass, NgIf } from '@angular/common';

import { OrderService } from '../../services/order.service';
import { CreateOrderDto } from '../../../../shared/models/create-order.model';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    NgIf
  ],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  orderForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  minDate: string;
  formSubmitted = false;

  // Currency options
  currencies = [
    { code: 'EUR', name: 'Euro (EUR)' },
    { code: 'USD', name: 'US Dollar (USD)' },
    { code: 'GBP', name: 'British Pound (GBP)' }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {
    // Set min date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    // Initialize the form
    this.orderForm = this.createOrderForm();
  }

  ngOnInit(): void {}

  /**
   * Create order form with validations
   */
  private createOrderForm(): FormGroup {
    return this.fb.group({
      orderNumber: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9-]+$'),
        Validators.maxLength(50)
      ]],
      paymentDescription: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
      streetAddress: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      town: ['', [
        Validators.required, 
        Validators.maxLength(50)
      ]],
      country: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      amount: ['', [
        Validators.required, 
        Validators.min(0.01), 
        Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
      ]],
      currency: ['EUR', [
        Validators.required
      ]],
      paymentDueDate: ['', [
        Validators.required
      ]]
    });
  }

  /**
   * Form submission handler
   */
  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.orderForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      this.markFormGroupTouched(this.orderForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const orderData: CreateOrderDto = this.orderForm.value;
    
    this.orderService.createOrder(orderData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          // Navigate to order list after successful creation
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          if (error.message.includes('already exists')) {
            this.errorMessage = 'Order number already exists. Please use a different number.';
          } else {
            this.errorMessage = error.message || 'An error occurred while creating the order. Please try again.';
          }
        }
      });
  }

  /**
   * Reset form to initial state
   */
  resetForm(): void {
    this.orderForm.reset({
      currency: 'EUR' // Reset with default currency
    });
    this.formSubmitted = false;
    this.errorMessage = null;
  }

  /**
   * Check if a control has an error
   * @param controlName Form control name
   * @param errorName Error name
   * @returns True if the control has the error
   */
  hasError(controlName: string, errorName: string): boolean {
    const control = this.orderForm.get(controlName);
    return !!control && ((control.touched || this.formSubmitted) && control.hasError(errorName));
  }

  /**
   * Mark all controls in a form group as touched
   * @param formGroup Form group to mark
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
