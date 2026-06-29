import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

export interface PatientHistory {
  id: number;
  date: string;
  diagnoses: string[];
  prescriptions: { medicine: string; dosage: string }[];
  doctorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}api/patients`;

  private get headers(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPatientHistory(id: string): Observable<PatientHistory[]> {
    return this.http.get<PatientHistory[]>(`${this.apiUrl}/${id}/history`, { headers: this.headers });
  }
}
