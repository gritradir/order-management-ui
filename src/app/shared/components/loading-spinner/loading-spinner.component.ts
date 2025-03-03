import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf],
  template: `
    <div class="flex justify-center items-center" [ngClass]="containerClasses">
      <div class="animate-spin rounded-full border-t-2 border-b-2 border-blue-500" 
           [ngClass]="spinnerClasses"></div>
      <span *ngIf="message" class="ml-3">{{ message }}</span>
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
  
  get spinnerClasses(): string {
    const sizeClass = {
      'sm': 'h-6 w-6',
      'md': 'h-10 w-10',
      'lg': 'h-16 w-16'
    };
    
    return sizeClass[this.size] || sizeClass.md;
  }
  
  get containerClasses(): string {
    return this.message ? 'py-4' : '';
  }
}