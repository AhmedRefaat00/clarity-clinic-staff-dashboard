import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { PaymentBadge } from '../../shared/components/payment-badge/payment-badge';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SkeletonRows } from '../../shared/components/skeleton-rows/skeleton-rows';
import { AppointmentsService, Appointment } from '../../core/services/appointments.service';
import { StaffService } from '../../core/services/staff.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadge, PaymentBadge, EmptyState, SkeletonRows],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar implements OnInit {
  private appointmentsService = inject(AppointmentsService);
  private staffService = inject(StaffService);

  doctors = signal<any[]>([]);
  appointmentsList = signal<Appointment[]>([]);

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

    this.loadDoctors();
  }

  loadDoctors(): void {
    this.staffService.getStaffList().subscribe({
      next: (staff: any) => {
        const docs = (staff || [])
          .filter((member: any) => member.role?.toLowerCase().includes('doctor'))
          .map((member: any) => ({
            id: member.id.toString(),
            displayName: member.name
          }));
        this.doctors.set(docs);
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        this.loadAppointments();
      }
    });
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.appointmentsService.getAppointments(this.date(), this.doctorId()).subscribe({
      next: (appts) => {
        this.appointmentsList.set(appts || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load appointments:', err);
        this.loading.set(false);
      }
    });
  }

  filteredAppointments = computed(() => {
    // Frontend-side filtering as fallback/refinement, but typically handled by params
    const filterDate = this.date();
    const filterDoc = this.doctorId();

    return this.appointmentsList().filter(a => {
      const matchDate = a.date === filterDate;
      const matchDoc = !filterDoc || a.doctorId.toString() === filterDoc;
      return matchDate && matchDoc;
    });
  });

  onDateOrDocChange(): void {
    this.loadAppointments();
  }

  setArrived(appt: Appointment): void {
    this.appointmentsService.markArrived(appt.id).subscribe({
      next: (updatedAppt) => {
        this.appointmentsList.update(list => list.map(a => 
          a.id === appt.id ? { ...a, status: 'Arrived' } : a
        ));
      },
      error: (err) => console.error('Failed to mark arrived:', err)
    });
  }

  setNoShow(appt: Appointment): void {
    this.appointmentsService.markNoShow(appt.id).subscribe({
      next: (updatedAppt) => {
        this.appointmentsList.update(list => list.map(a => 
          a.id === appt.id ? { ...a, status: 'NoShow' } : a
        ));
      },
      error: (err) => console.error('Failed to mark no-show:', err)
    });
  }

  cancelAppt(appt: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentsService.cancelAppointment(appt.id).subscribe({
        next: () => {
          this.appointmentsList.update(list => list.map(a => 
            a.id === appt.id ? { ...a, status: 'Cancelled' } : a
          ));
        },
        error: (err) => console.error('Failed to cancel appointment:', err)
      });
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

    this.appointmentsService.rescheduleAppointment(appt.id, this.rDate, this.rTime).subscribe({
      next: (updated) => {
        this.appointmentsList.update(list => list.map(a => 
          a.id === appt.id ? { ...a, date: this.rDate, startTime: this.rTime } : a
        ));
        this.rescheduling.set(null);
      },
      error: (err) => console.error('Failed to reschedule appointment:', err)
    });
  }

  confirmCashPaid(): void {
    const appt = this.confirmingCash();
    if (!appt || !appt.payment) return;

    this.appointmentsService.confirmCashPaid(appt.id).subscribe({
      next: (updated) => {
        this.appointmentsList.update(list => list.map(a => 
          a.id === appt.id ? { ...a, payment: { ...a.payment!, status: 'Paid' } } : a
        ));
        this.confirmingCash.set(null);
      },
      error: (err) => console.error('Failed to confirm cash payment:', err)
    });
  }
}

