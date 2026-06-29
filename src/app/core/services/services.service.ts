import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

export interface ClinicService {
  id: number;
  name: string;
  doctorId: string;
  doctorName?: string;
  durationMinutes: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private servicesUrl = `${environment.apiUrl}api/admin/services`;

  private get headers(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getServicesList(): Observable<ClinicService[]> {
    return this.http.get<ClinicService[]>(this.servicesUrl, { headers: this.headers });
  }

  addService(service: Omit<ClinicService, 'id' | 'doctorName'>): Observable<ClinicService> {
    return this.http.post<ClinicService>(this.servicesUrl, service, { headers: this.headers });
  }

  updateService(id: number, service: Omit<ClinicService, 'id' | 'doctorName'>): Observable<ClinicService> {
    return this.http.put<ClinicService>(`${this.servicesUrl}/${id}`, service, { headers: this.headers });
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete<any>(`${this.servicesUrl}/${id}`, { headers: this.headers });
  }
}
