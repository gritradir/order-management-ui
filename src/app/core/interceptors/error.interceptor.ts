import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';
      
      if (error.status === 0) {
        // Client-side or network error
        errorMessage = 'Network error. Please check your connection.';
        console.error('Network error:', error.error);
      } else {
        // Server-side error with status code
        switch (error.status) {
          case 401: // Unauthorized
            errorMessage = 'Unauthorized access';
            // Handle authentication error (e.g., redirect to login)
            break;
            
          case 403: // Forbidden
            errorMessage = 'You do not have permission to access this resource';
            break;
            
          case 404: // Not Found
            errorMessage = 'Resource not found';
            break;
            
          case 409: // Conflict
            errorMessage = error.error.message || 'A conflict occurred with your request';
            break;
            
          case 422: // Validation Error
            errorMessage = 'Validation error';
            if (error.error.message && Array.isArray(error.error.message)) {
              errorMessage = error.error.message.join(', ');
            } else if (error.error.message) {
              errorMessage = error.error.message;
            }
            break;
            
          case 500: // Server Error
            errorMessage = 'Internal server error';
            break;
            
          default:
            errorMessage = `Error ${error.status}: ${error.error.message || error.statusText}`;
            break;
        }
      }

      // Optionally display the error message to the user via a service
      // const notificationService = inject(NotificationService);
      // notificationService.showError(errorMessage);
      
      // Return the error for further handling
      return throwError(() => new Error(errorMessage));
    })
  );
};