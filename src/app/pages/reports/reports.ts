import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatusMixItem {
  status: string;
  count: number;
}

interface RevenueItem {
  date: string;
  revenue: number;
}

interface DoctorUtilItem {
  doctorName: string;
  completedAppointments: number;
  appointments: number;
}

interface ServiceRevenueItem {
  serviceName: string;
  revenue: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  loading = signal(true);

  appointmentsByStatus = signal<StatusMixItem[]>([
    { status: 'Confirmed', count: 75 },
    { status: 'Completed', count: 18 },
    { status: 'Cancelled', count: 5 },
    { status: 'NoShow', count: 2 }
  ]);

  revenueByDay = signal<RevenueItem[]>([
    { date: 'Sat', revenue: 1200 },
    { date: 'Sun', revenue: 370 },
    { date: 'Mon', revenue: 1500 },
    { date: 'Tue', revenue: 800 },
    { date: 'Wed', revenue: 600 },
    { date: 'Thu', revenue: 950 },
    { date: 'Fri', revenue: 0 }
  ]);

  doctorUtilization = signal<DoctorUtilItem[]>([
    { doctorName: 'zyad', completedAppointments: 45, appointments: 47 },
    { doctorName: 'Dr. Ahmed Ali', completedAppointments: 12, appointments: 18 },
    { doctorName: 'heldadoc', completedAppointments: 14, appointments: 18 },
    { doctorName: 'Dr Test', completedAppointments: 8, appointments: 12 }
  ]);

  revenueByService = signal<ServiceRevenueItem[]>([
    { serviceName: 'General Consultation', revenue: 4500 },
    { serviceName: 'Dental Cleaning', revenue: 3600 },
    { serviceName: 'Pediatric Checkup', revenue: 2400 },
    { serviceName: 'Cardiology Review', revenue: 1500 }
  ]);

  noShowRate = 0.02; // 2%

  maxStatus = computed(() => {
    return Math.max(1, ...this.appointmentsByStatus().map(item => item.count));
  });

  maxRevenue = computed(() => {
    return Math.max(1, ...this.revenueByDay().map(item => item.revenue));
  });

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 450);
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  getPct(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }
}
