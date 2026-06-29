import { Component, inject, OnInit, signal } from '@angular/core';
import { SummaryCard } from "./components/summary-card/summary-card";
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [SummaryCard, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  summaryCards = signal([
    { title: "Today's appointments", icon: "images/calendar.svg", value: 0 },
    { title: "Confirmed", icon: "images/confirmed.svg", value: 0 },
    { title: "Checked in", icon: "images/person.svg", value: 0 },
    { title: "Today's revenue", icon: "images/sales-amount.svg", value: 0, suffix: "EGP" },
  ]);

  appointmentStatusData = signal<any[]>([]);

  doctorUtilizationData = signal<any[]>([]);

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.summaryCards.set([
          { title: "Today's appointments", icon: "images/calendar.svg", value: stats.todayAppointments },
          { title: "Confirmed", icon: "images/confirmed.svg", value: stats.confirmedCount },
          { title: "Checked in", icon: "images/person.svg", value: stats.checkedInCount },
          { title: "Today's revenue", icon: "images/sales-amount.svg", value: stats.todayRevenue, suffix: "EGP" },
        ]);
        this.appointmentStatusData.set(stats.statusStats || []);
        this.doctorUtilizationData.set(stats.doctorUtilization || []);
      },
      error: (err) => {
        console.error('Failed to load dashboard stats:', err);
      }
    });
  }

  getMaxAppointmentValue(): number {
    const data = this.appointmentStatusData();
    if (data.length === 0) return 1;
    return Math.max(...data.map(d => d.value), 1);
  }

  getUtilizationPercentage(current: number, total: number): number {
    if (total === 0) return 0;
    return (current / total) * 100;
  }
}
