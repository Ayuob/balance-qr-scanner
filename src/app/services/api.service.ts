import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SubmissionData {
  qrData: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;
  private readonly TIMEOUT = 10000; // 10 seconds
  private readonly MAX_RETRIES = 3;

  constructor(private http: HttpClient) {}

  async submitData(data: SubmissionData): Promise<any> {
    return this.http.post(`${this.API_URL}/submit`, data)
      .pipe(
        timeout(this.TIMEOUT),
        retry(this.MAX_RETRIES)
      )
      .toPromise()
      .catch((error: HttpErrorResponse) => {
        if (error.status === 0) {
          throw new Error('Network error. Please check your connection.');
        }
        throw error;
      });
  }
}