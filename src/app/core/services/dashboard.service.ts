import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

export interface DashboardStats {
  todayAppointments: number;
  confirmedCount: number;
  checkedInCount: number;
  todayRevenue: number;
  statusStats: { label: string; value: number }[];
  doctorUtilization: { name: string; initials: string; current: number; total: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}api/dashboard`;

  private get headers(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { headers: this.headers });
  }
}
