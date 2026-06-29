import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private authService = inject(AuthService);

  name = signal('');
  email = signal('');
  phone = signal('');

  currentPassword = '';
  newPassword = '';

  savingProfile = signal(false);
  updatingPassword = signal(false);

  showSuccessToast = signal(false);
  successMsg = signal('');

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (user) => {
        this.name.set(user?.name || '');
        this.email.set(user?.email || '');
        this.phone.set(user?.phone || '');
      },
      error: (err) => {
        console.error('Failed to load profile details:', err);
      }
    });
  }

  saveProfile(): void {
    if (!this.name() || !this.phone()) return;

    this.savingProfile.set(true);
    this.authService.updateProfile({
      name: this.name(),
      email: this.email(),
      phone: this.phone()
    }).subscribe({
      next: () => {
        this.savingProfile.set(false);
        this.triggerToast('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.savingProfile.set(false);
      }
    });
  }

  changePassword(): void {
    if (!this.currentPassword || this.newPassword.length < 6) return;

    this.updatingPassword.set(true);
    this.authService.updatePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.updatingPassword.set(false);
        this.currentPassword = '';
        this.newPassword = '';
        this.triggerToast('Password updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update password:', err);
        this.updatingPassword.set(false);
      }
    });
  }

  triggerToast(msg: string): void {
    this.successMsg.set(msg);
    this.showSuccessToast.set(true);
    setTimeout(() => {
      this.showSuccessToast.set(false);
    }, 1500);
  }
}

