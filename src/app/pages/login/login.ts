import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = 'admin@clinic.local';
  password = '';
  
  isSubmitting = false;
  errorMessage = '';
  
  isDarkMode = signal<boolean>(document.body.classList.contains('dark-theme'));
  currentLang = signal<'en' | 'ar'>('en');

  toggleTheme(): void {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      this.isDarkMode.set(false);
    } else {
      body.classList.add('dark-theme');
      this.isDarkMode.set(true);
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.currentLang.set(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = this.currentLang() === 'ar'
        ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
        : 'Please enter both email and password.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        this.errorMessage = this.currentLang() === 'ar'
          ? 'فشل تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
          : 'Login failed. Please check your credentials and try again.';
      }
    });
  }
}
