import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SkeletonRows } from '../../shared/components/skeleton-rows/skeleton-rows';

interface Service {
  id: number;
  name: string;
  doctorId: string;
  doctorName: string;
  durationMinutes: number;
  price: number;
}

interface ServiceForm {
  id: number | null;
  name: string;
  doctorId: string;
  durationMinutes: number;
  price: number;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyState, SkeletonRows],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {
  doctorsList = signal([
    { id: '1', displayName: 'Dr. Ahmed Ali' },
    { id: '2', displayName: 'Dr. Sarah Connor' },
    { id: '3', displayName: 'Dr. John Watson' },
    { id: '4', displayName: 'Dr. Gregory House' }
  ]);

  servicesList = signal<Service[]>([
    { id: 1, name: 'General Consultation', doctorId: '1', doctorName: 'Dr. Ahmed Ali', durationMinutes: 20, price: 150 },
    { id: 2, name: 'Dental Cleaning', doctorId: '2', doctorName: 'Dr. Sarah Connor', durationMinutes: 45, price: 300 },
    { id: 3, name: 'Pediatric Checkup', doctorId: '3', doctorName: 'Dr. John Watson', durationMinutes: 30, price: 200 },
    { id: 4, name: 'Cardiology Review', doctorId: '4', doctorName: 'Dr. Gregory House', durationMinutes: 60, price: 500 }
  ]);

  form = signal<ServiceForm | null>(null);
  loading = signal(true);
  saving = signal(false);

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 400);
  }

  startAdd(): void {
    const defaultDoctor = this.doctorsList()[0]?.id || '';
    this.form.set({
      id: null,
      name: '',
      doctorId: defaultDoctor,
      durationMinutes: 30,
      price: 0
    });
  }

  startEdit(service: Service): void {
    this.form.set({
      id: service.id,
      name: service.name,
      doctorId: service.doctorId,
      durationMinutes: service.durationMinutes,
      price: service.price
    });
  }

  cancelEdit(): void {
    this.form.set(null);
  }

  save(): void {
    const data = this.form();
    if (!data || !data.name) return;

    this.saving.set(true);

    const docName = this.doctorsList().find(d => d.id === data.doctorId)?.displayName || 'Unknown Doctor';

    setTimeout(() => {
      if (data.id === null) {
        // Create new service
        const newService: Service = {
          id: Date.now(),
          name: data.name,
          doctorId: data.doctorId,
          doctorName: docName,
          durationMinutes: data.durationMinutes,
          price: data.price
        };
        this.servicesList.update(list => [...list, newService]);
      } else {
        // Update existing service
        this.servicesList.update(list => list.map(s => 
          s.id === data.id 
            ? { ...s, name: data.name, doctorId: data.doctorId, doctorName: docName, durationMinutes: data.durationMinutes, price: data.price }
            : s
        ));
      }
      this.saving.set(false);
      this.form.set(null);
    }, 300);
  }

  remove(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.servicesList.update(list => list.filter(s => s.id !== id));
    }
  }
}
