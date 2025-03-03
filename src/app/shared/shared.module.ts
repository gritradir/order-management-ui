import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    // Shared components, directives, and pipes will be declared here
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // Re-export modules that will be commonly used in feature modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Also export any shared components, directives, and pipes
  ]
})
export class SharedModule { }
