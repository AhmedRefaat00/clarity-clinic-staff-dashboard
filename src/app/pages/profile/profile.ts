import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  name = signal('System Admin');
  email = signal('admin@clinic.local');
  phone = signal('01011223344');

  currentPassword = '';
  newPassword = '';

  savingProfile = signal(false);
  updatingPassword = signal(false);

  showSuccessToast = signal(false);
  successMsg = signal('');

  ngOnInit(): void {}

  saveProfile(): void {
    if (!this.name() || !this.phone()) return;

    this.savingProfile.set(true);
    setTimeout(() => {
      this.savingProfile.set(false);
      this.triggerToast('Profile updated successfully!');
    }, 400);
  }

  changePassword(): void {
    if (!this.currentPassword || this.newPassword.length < 6) return;

    this.updatingPassword.set(true);
    setTimeout(() => {
      this.updatingPassword.set(false);
      this.currentPassword = '';
      this.newPassword = '';
      this.triggerToast('Password updated successfully!');
    }, 400);
  }

  triggerToast(msg: string): void {
    this.successMsg.set(msg);
    this.showSuccessToast.set(true);
    setTimeout(() => {
      this.showSuccessToast.set(false);
    }, 1500);
  }
}
