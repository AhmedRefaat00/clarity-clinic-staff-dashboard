import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}api/auth`;

  // Signal لمعرفة حالة تسجيل الدخول في أي مكان في التطبيق بسهولة
  isAuthenticated = signal<boolean>(this.hasToken());

  /**
   * دالة تسجيل الدخول
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      // نستخدم tap للقيام بإجراء جانبي (حفظ التوكن) دون تغيير شكل البيانات العائدة
      tap((response) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  /**
   * دالة تسجيل الخروج
   */
  logout(): void {
    localStorage.removeItem('staff_token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']); // توجيه المستخدم لصفحة الدخول
  }

  /**
   * Get current user profile details
   */
  getMe(): Observable<any> {
    const token = this.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/me`, { headers });
  }

  /**
   * Update profile details
   */
  updateProfile(profile: { name: string; email: string; phone: string }): Observable<any> {
    const token = this.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrl}/profile`, profile, { headers });
  }

  /**
   * Change user password
   */
  updatePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    const token = this.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrl}/password`, passwordData, { headers });
  }

  /**
   * حفظ التوكن في المتصفح
   */
  private setToken(token: string): void {
    localStorage.setItem('staff_token', token);
  }

  /**
   * استرجاع التوكن
   */
  getToken(): string | null {
    return localStorage.getItem('staff_token');
  }

  /**
   * التحقق من وجود توكن (تستخدم عند تهيئة الـ Signal)
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }
}