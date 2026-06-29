import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';
import { UpdateServiceRequest } from '../models/service.model';



@Injectable({
  providedIn: 'root',
})
export class ServicesService {

  private http = inject(HttpClient);
  private staffUrl = `${environment.apiUrl}/api/appointments`
  authService = inject(AuthService)
  token = this.authService.getToken();
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  })


  getAllServices() {
    return this.http.get(this.staffUrl, { headers: this.headers });
  }

  editService(id: number, data: UpdateServiceRequest) {
    return this.http.put(`${this.staffUrl}/${id}`, data, { headers: this.headers });
  }

  deleteService(id: number) {
    return this.http.delete(`${this.staffUrl}/${id}`, { headers: this.headers });
  }


}
