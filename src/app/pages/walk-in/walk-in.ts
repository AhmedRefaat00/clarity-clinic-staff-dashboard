import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Doctor {
  id: string;
  name: string;
  services: { id: number; name: string; durationMinutes: number }[];
}

@Component({
  selector: 'app-walk-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './walk-in.html',
  styleUrl: './walk-in.css'
})
export class WalkIn implements OnInit {
  private router = inject(Router);

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

  // Mock data
  doctors = signal<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Ahmed Ali',
      services: [
        { id: 1, name: 'General Consultation', durationMinutes: 20 },
        { id: 3, name: 'Pediatric Checkup', durationMinutes: 30 }
      ]
    },
    {
      id: '2',
      name: 'Dr. Sarah Connor',
      services: [
        { id: 2, name: 'Dental Cleaning', durationMinutes: 45 }
      ]
    },
    {
      id: '4',
      name: 'Dr. Gregory House',
      services: [
        { id: 4, name: 'Cardiology Review', durationMinutes: 60 }
      ]
    }
  ]);

  patients = signal([
    { id: '101', name: 'Sarah Connor', phone: '01012345678' },
    { id: '102', name: 'John Doe', phone: '01122334455' },
    { id: '103', name: 'Alice Smith', phone: '01234567890' },
    { id: '104', name: 'Bob Johnson', phone: '01599887766' }
  ]);

  // List of services for the selected doctor
  services = computed(() => {
    const doc = this.doctors().find(d => d.id === this.doctorId());
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
  availableSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00'];
  takenSlots = ['10:00', '11:30', '14:30'];

  ngOnInit(): void {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    this.today = `${yyyy}-${mm}-${dd}`;
    this.bookingDate.set(this.today);
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
    if (this.doctorId() && this.serviceId()) {
      this.slotsLoading.set(true);
      setTimeout(() => {
        this.slotsLoading.set(false);
      }, 300);
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

    setTimeout(() => {
      this.booking.set(false);
      this.showSuccess.set(true);

      // Navigate after show success toast
      setTimeout(() => {
        this.showSuccess.set(false);
        this.router.navigate(['/calendar']);
      }, 1500);
    }, 800);
  }
}
