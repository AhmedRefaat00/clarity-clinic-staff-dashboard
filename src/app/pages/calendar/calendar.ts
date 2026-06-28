import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { PaymentBadge } from '../../shared/components/payment-badge/payment-badge';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SkeletonRows } from '../../shared/components/skeleton-rows/skeleton-rows';

interface Appointment {
  id: number;
  startTime: string;
  patientName: string;
  doctorName: string;
  doctorId: string;
  serviceName: string;
  status: string; // Confirmed, Arrived, NoShow, Cancelled, Completed, PendingPayment
  payment?: {
    status: string; // Paid, Pending
    method: string; // Cash, Card
  };
  date: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadge, PaymentBadge, EmptyState, SkeletonRows],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar implements OnInit {
  doctors = signal([
    { id: '1', displayName: 'Dr. Ahmed Ali' },
    { id: '2', displayName: 'Dr. Sarah Connor' },
    { id: '3', displayName: 'Dr. John Watson' },
    { id: '4', displayName: 'Dr. Gregory House' }
  ]);

  appointmentsList = signal<Appointment[]>([
    { id: 1, startTime: '09:00', patientName: 'Sarah Connor', doctorName: 'Dr. Ahmed Ali', doctorId: '1', serviceName: 'General Consultation', status: 'Confirmed', payment: { status: 'Pending', method: 'Cash' }, date: '2026-06-28' },
    { id: 2, startTime: '10:00', patientName: 'John Doe', doctorName: 'Dr. Sarah Connor', doctorId: '2', serviceName: 'Dental Cleaning', status: 'Arrived', payment: { status: 'Paid', method: 'Card' }, date: '2026-06-28' },
    { id: 3, startTime: '11:30', patientName: 'Alice Smith', doctorName: 'Dr. Ahmed Ali', doctorId: '1', serviceName: 'Pediatric Checkup', status: 'PendingPayment', payment: { status: 'Pending', method: 'Cash' }, date: '2026-06-28' },
    { id: 4, startTime: '14:00', patientName: 'Bob Johnson', doctorName: 'Dr. Gregory House', doctorId: '4', serviceName: 'Cardiology Review', status: 'Completed', payment: { status: 'Paid', method: 'Card' }, date: '2026-06-28' }
  ]);

  date = signal('');
  doctorId = signal('');
  loading = signal(true);

  // Modal states
  confirmingCash = signal<Appointment | null>(null);
  rescheduling = signal<Appointment | null>(null);

  // Reschedule Form Fields
  rDate = '';
  rTime = '';

  ngOnInit(): void {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    this.date.set(`${yyyy}-${mm}-${dd}`);

    setTimeout(() => {
      this.loading.set(false);
    }, 400);
  }

  filteredAppointments = computed(() => {
    const filterDate = this.date();
    const filterDoc = this.doctorId();

    return this.appointmentsList().filter(a => {
      const matchDate = a.date === filterDate;
      const matchDoc = !filterDoc || a.doctorId === filterDoc;
      return matchDate && matchDoc;
    });
  });

  onDateOrDocChange(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 250);
  }

  setArrived(appt: Appointment): void {
    this.appointmentsList.update(list => list.map(a => 
      a.id === appt.id ? { ...a, status: 'Arrived' } : a
    ));
  }

  setNoShow(appt: Appointment): void {
    this.appointmentsList.update(list => list.map(a => 
      a.id === appt.id ? { ...a, status: 'NoShow' } : a
    ));
  }

  cancelAppt(appt: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentsList.update(list => list.map(a => 
        a.id === appt.id ? { ...a, status: 'Cancelled' } : a
      ));
    }
  }

  openReschedule(appt: Appointment): void {
    this.rescheduling.set(appt);
    this.rDate = appt.date;
    this.rTime = appt.startTime;
  }

  saveReschedule(): void {
    const appt = this.rescheduling();
    if (!appt || !this.rDate || !this.rTime) return;

    this.appointmentsList.update(list => list.map(a => 
      a.id === appt.id ? { ...a, date: this.rDate, startTime: this.rTime } : a
    ));
    this.rescheduling.set(null);
  }

  confirmCashPaid(): void {
    const appt = this.confirmingCash();
    if (!appt || !appt.payment) return;

    this.appointmentsList.update(list => list.map(a => 
      a.id === appt.id ? { ...a, payment: { ...a.payment!, status: 'Paid' } } : a
    ));
    this.confirmingCash.set(null);
  }
}
