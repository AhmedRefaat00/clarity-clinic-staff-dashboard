import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SkeletonRows } from '../../shared/components/skeleton-rows/skeleton-rows';
import { ServicesService, ClinicService } from '../../core/services/services.service';
import { StaffService } from '../../core/services/staff.service';

interface DoctorSelect {
  id: string;
  displayName: string;
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
  private servicesService = inject(ServicesService);
  private staffService = inject(StaffService);

  doctorsList = signal<DoctorSelect[]>([]);
  servicesList = signal<ClinicService[]>([]);

  form = signal<ServiceForm | null>(null);
  loading = signal(true);
  saving = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    // Fetch staff list first
    this.staffService.getStaffList().subscribe({
      next: (staff: any) => {
        // Map staff members with role 'doctor' or containing 'doctor' (case-insensitive)
        const doctors = (staff || [])
          .filter((member: any) => member.role?.toLowerCase().includes('doctor'))
          .map((member: any) => ({
            id: member.id.toString(),
            displayName: member.name
          }));
        this.doctorsList.set(doctors);

        // Then fetch services list
        this.servicesService.getServicesList().subscribe({
          next: (services: ClinicService[]) => {
            // Map doctorName if it is missing from the service payload but present in doctorsList
            const mappedServices = services.map(s => ({
              ...s,
              doctorName: s.doctorName || this.doctorsList().find(d => d.id === s.doctorId.toString())?.displayName || 'Unknown Doctor'
            }));
            this.servicesList.set(mappedServices);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Failed to load services:', err);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load staff/doctors:', err);
        this.loading.set(false);
      }
    });
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

  startEdit(service: ClinicService): void {
    this.form.set({
      id: service.id,
      name: service.name,
      doctorId: service.doctorId.toString(),
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
    const servicePayload = {
      name: data.name,
      doctorId: data.doctorId,
      durationMinutes: data.durationMinutes,
      price: data.price
    };

    if (data.id === null) {
      // Create new service
      this.servicesService.addService(servicePayload).subscribe({
        next: (newService) => {
          const addedService: ClinicService = {
            ...newService,
            doctorName: docName
          };
          this.servicesList.update(list => [...list, addedService]);
          this.saving.set(false);
          this.form.set(null);
        },
        error: (err) => {
          console.error('Failed to add service:', err);
          this.saving.set(false);
        }
      });
    } else {
      // Update existing service
      this.servicesService.updateService(data.id, servicePayload).subscribe({
        next: (updatedService) => {
          this.servicesList.update(list => list.map(s => 
            s.id === data.id 
              ? { ...s, ...updatedService, doctorName: docName }
              : s
          ));
          this.saving.set(false);
          this.form.set(null);
        },
        error: (err) => {
          console.error('Failed to update service:', err);
          this.saving.set(false);
        }
      });
    }
  }

  remove(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.servicesService.deleteService(id).subscribe({
        next: () => {
          this.servicesList.update(list => list.filter(s => s.id !== id));
        },
        error: (err) => {
          console.error('Failed to delete service:', err);
        }
      });
    }
  }
}

