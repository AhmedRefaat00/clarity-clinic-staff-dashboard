import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SkeletonRows } from '../../shared/components/skeleton-rows/skeleton-rows';

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  hasLogin: boolean;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyState, SkeletonRows],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class Patients implements OnInit {
  patientsList = signal<Patient[]>([
    { id: 1, name: 'Sarah Connor', phone: '01012345678', email: 'sarah.connor@sky.net', hasLogin: true },
    { id: 2, name: 'John Doe', phone: '01122334455', email: 'john.doe@gmail.com', hasLogin: false },
    { id: 3, name: 'Alice Smith', phone: '01234567890', email: 'alice.smith@example.com', hasLogin: true },
    { id: 4, name: 'Bob Johnson', phone: '01599887766', email: null, hasLogin: false },
    { id: 5, name: 'Charlie Brown', phone: '01088776655', email: 'charlie@peanuts.com', hasLogin: true }
  ]);

  adding = signal(false);
  loading = signal(true);
  searchQuery = signal('');

  // Form fields
  newName = '';
  newPhone = '';
  newEmail = '';

  ngOnInit(): void {
    // Simulate premium loader
    setTimeout(() => {
      this.loading.set(false);
    }, 400);
  }

  filteredPatients = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.patientsList();
    return this.patientsList().filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.phone.includes(query) || 
      (p.email && p.email.toLowerCase().includes(query))
    );
  });

  toggleAdd(): void {
    this.adding.set(!this.adding());
    this.resetForm();
  }

  resetForm(): void {
    this.newName = '';
    this.newPhone = '';
    this.newEmail = '';
  }

  onSubmit(): void {
    if (!this.newName || !this.newPhone) return;

    const newPatient: Patient = {
      id: Date.now(),
      name: this.newName,
      phone: this.newPhone,
      email: this.newEmail || null,
      hasLogin: false // Default to walk-in only on creation
    };

    // Simulate save
    this.loading.set(true);
    setTimeout(() => {
      this.patientsList.update(list => [newPatient, ...list]);
      this.loading.set(false);
      this.toggleAdd();
    }, 300);
  }
}
