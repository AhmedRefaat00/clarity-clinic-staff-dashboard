import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

export interface Appointment {
  id: number;
  startTime: string;
  patientName: string;
  doctorName: string;
  doctorId: string;
  serviceName: string;
  status: string; // Confirmed, Arrived, NoShow, Cancelled, Completed, PendingPayment
  payment?: {
    status: string; // Paid, Pending
    method: string; // Cash, Card
  };
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}api/appointments`;
  private meUrl = `${environment.apiUrl}api/me`;

  private get headers(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAppointments(date?: string, doctorId?: string): Observable<Appointment[]> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    if (doctorId) params = params.set('doctorId', doctorId);
    return this.http.get<Appointment[]>(this.apiUrl, { headers: this.headers, params });
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.meUrl}/appointments`, { headers: this.headers });
  }

  getMyPrescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.meUrl}/prescriptions`, { headers: this.headers });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  bookWalkIn(bookingData: {
    patientMode: 'existing' | 'new';
    patientId?: string | null;
    npName?: string;
    npPhone?: string;
    npEmail?: string;
    doctorId: string;
    serviceId: number;
    bookingDate: string;
    slot: string;
  }): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/walk-in`, bookingData, { headers: this.headers });
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.headers });
  }

  rescheduleAppointment(id: number, date: string, startTime: string): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/reschedule`, { date, startTime }, { headers: this.headers });
  }

  markArrived(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/arrived`, {}, { headers: this.headers });
  }

  markNoShow(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/no-show`, {}, { headers: this.headers });
  }

  confirmCashPaid(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/cash-paid`, {}, { headers: this.headers });
  }

  markComplete(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/complete`, {}, { headers: this.headers });
  }
}
