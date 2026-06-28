import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

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

  logout(): void {
    this.authService.logout();
  }
}
