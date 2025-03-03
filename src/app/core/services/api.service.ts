import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiErrorResponse } from '../../shared/models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET method with type safety
   * @param url API endpoint path (will be appended to base URL)
   * @param params Optional query parameters
   * @returns Observable of the response
   */
  public get<T>(url: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<T>(`${this.baseUrl}/${url}`, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Generic POST method with type safety
   * @param url API endpoint path (will be appended to base URL)
   * @param body Request body
   * @returns Observable of the response
   */
  public post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Error handler for API requests
   * @param error HTTP error
   * @returns Observable with error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      const apiError = error.error as ApiErrorResponse;
      if (apiError && apiError.message) {
        if (Array.isArray(apiError.message)) {
          errorMessage = apiError.message.join(', ');
        } else {
          errorMessage = apiError.message;
        }
      } else {
        errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
      }
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
