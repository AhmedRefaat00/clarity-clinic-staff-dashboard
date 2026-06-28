import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class StaffService {
  private http = inject(HttpClient);
  private staffUrl = `${environment.apiUrl}api/admin/staff`
  authService = inject(AuthService)
  token = this.authService.getToken();
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  })

  getStaffList() {
    return this.http.get(this.staffUrl, { headers: this.headers });
  }

  toggleStaffStatus(id: string) {
    return this.http.post(`${this.staffUrl}/${id}/toggle`, {}, { headers: this.headers });
  }
}
