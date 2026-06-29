import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

export interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  services: { id: number; name: string; durationMinutes: number }[];
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}api/doctors`;

  private get headers(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl, { headers: this.headers });
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  getSlots(id: string, date: string): Observable<string[]> {
    let params = new HttpParams().set('date', date);
    return this.http.get<string[]>(`${this.apiUrl}/${id}/slots`, { headers: this.headers, params });
  }

  getAvailability(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/availability`, { headers: this.headers });
  }

  getBlockedDates(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${id}/blocked-dates`, { headers: this.headers });
  }

  blockDate(id: string, date: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/blocked-dates`, { date }, { headers: this.headers });
  }

  unblockDate(id: string, date: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/blocked-dates/${date}`, { headers: this.headers });
  }
}
