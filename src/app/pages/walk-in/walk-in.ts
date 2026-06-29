import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AvailabilityService, Doctor } from '../../core/services/availability.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-walk-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './walk-in.html',
  styleUrl: './walk-in.css'
})
export class WalkIn implements OnInit {
  private router = inject(Router);
  private availabilityService = inject(AvailabilityService);
  private appointmentsService = inject(AppointmentsService);
  private http = inject(HttpClient);

  today = '';
  patientMode = signal<'existing' | 'new'>('existing');
  patientSearch = signal('');
  selectedPatientId = signal<string | null>(null);

  // New Patient Form
  npName = '';
  npPhone = '';
  npEmail = '';

  // Booking selections
  doctorId = signal('');
  serviceId = signal<number | null>(null);
  bookingDate = signal('');
  selectedSlot = signal<string>('');
  booking = signal(false);
  slotsLoading = signal(false);

  // Success message state
  showSuccess = signal(false);

  doctors = signal<Doctor[]>([]);
  patients = signal<any[]>([
    { id: '101', name: 'Sarah Connor', phone: '01012345678' },
    { id: '102', name: 'John Doe', phone: '01122334455' },
    { id: '103', name: 'Alice Smith', phone: '01234567890' },
    { id: '104', name: 'Bob Johnson', phone: '01599887766' }
  ]);

  // List of services for the selected doctor
  services = computed(() => {
    const doc = this.doctors().find(d => d.id.toString() === this.doctorId());
    return doc ? doc.services : [];
  });

  // Filtered patients based on search
  filteredPatients = computed(() => {
    const query = this.patientSearch().toLowerCase().trim();
    if (!query) return this.patients();
    return this.patients().filter(p => 
      p.name.toLowerCase().includes(query) || p.phone.includes(query)
    );
  });

  // Available times slots
  availableSlots: string[] = [];
  takenSlots: string[] = []; // Used if backend returns all slots with availability status

  ngOnInit(): void {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    this.today = `${yyyy}-${mm}-${dd}`;
    this.bookingDate.set(this.today);

    this.loadDoctors();
    this.loadPatients();
  }

  loadDoctors(): void {
    this.availabilityService.getDoctors().subscribe({
      next: (docs) => this.doctors.set(docs || []),
      error: (err) => console.error('Failed to load doctors for walk-in:', err)
    });
  }

  loadPatients(): void {
    const token = localStorage.getItem('staff_token');
    this.http.get<any[]>(`${environment.apiUrl}api/patients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.patients.set(data);
        }
      },
      error: (err) => console.log('Using fallback mock patients list', err)
    });
  }

  onDoctorChange(): void {
    this.serviceId.set(null);
    this.selectedSlot.set('');
    this.triggerSlotsLoad();
  }

  onServiceChange(): void {
    this.selectedSlot.set('');
    this.triggerSlotsLoad();
  }

  onDateChange(): void {
    this.selectedSlot.set('');
    this.triggerSlotsLoad();
  }

  triggerSlotsLoad(): void {
    if (this.doctorId() && this.bookingDate()) {
      this.slotsLoading.set(true);
      this.availabilityService.getSlots(this.doctorId(), this.bookingDate()).subscribe({
        next: (slots) => {
          this.availableSlots = slots || [];
          this.slotsLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load slots:', err);
          this.slotsLoading.set(false);
        }
      });
    }
  }

  selectSlot(slot: string): void {
    if (this.isSlotTaken(slot)) return;
    this.selectedSlot.set(slot);
  }

  isSlotTaken(slot: string): boolean {
    return this.takenSlots.includes(slot);
  }

  canBook = computed(() => {
    const hasPatient = this.patientMode() === 'existing' 
      ? !!this.selectedPatientId() 
      : (!!this.npName && !!this.npPhone);
    return hasPatient && !!this.doctorId() && !!this.serviceId() && !!this.selectedSlot();
  });

  book(): void {
    if (!this.canBook() || this.booking()) return;

    this.booking.set(true);

    const bookingPayload = {
      patientMode: this.patientMode(),
      patientId: this.patientMode() === 'existing' ? this.selectedPatientId() : null,
      npName: this.patientMode() === 'new' ? this.npName : undefined,
      npPhone: this.patientMode() === 'new' ? this.npPhone : undefined,
      npEmail: this.patientMode() === 'new' ? this.npEmail : undefined,
      doctorId: this.doctorId(),
      serviceId: this.serviceId()!,
      bookingDate: this.bookingDate(),
      slot: this.selectedSlot()
    };

    this.appointmentsService.bookWalkIn(bookingPayload).subscribe({
      next: () => {
        this.booking.set(false);
        this.showSuccess.set(true);

        setTimeout(() => {
          this.showSuccess.set(false);
          this.router.navigate(['/calendar']);
        }, 1500);
      },
      error: (err) => {
        console.error('Failed to book walk-in:', err);
        this.booking.set(false);
      }
    });
  }
}

