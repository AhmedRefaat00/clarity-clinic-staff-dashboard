import { Component, signal } from '@angular/core';
import { SummaryCard } from "./components/summary-card/summary-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [SummaryCard, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  summaryCards = signal([
    { title: "Today's appointments", icon: "images/calendar.svg", value: 8 },
    { title: "Confirmed", icon: "images/confirmed.svg", value: 7 },
    { title: "Checked in", icon: "images/person.svg", value: 0 },
    { title: "Today's revenue", icon: "images/sales-amount.svg", value: 370, suffix: "EGP" },
  ]);

  appointmentStatusData = signal([
    { label: 'Checked in', value: 6 },
    { label: 'Cancelled', value: 5 },
    { label: 'Completed', value: 5 },
    { label: 'Confirmed', value: 75 },
    { label: 'No-show', value: 2 },
    { label: 'Awaiting payment', value: 2 }
  ]);

  doctorUtilizationData = signal([
    { name: 'zyad', initials: 'Z', current: 1, total: 47 },
    { name: 'Dr. Ahmed Ali', initials: 'DA', current: 0, total: 18 },
    { name: 'heldadoc', initials: 'H', current: 4, total: 18 },
    { name: 'Dr Test', initials: 'DT', current: 0, total: 12 }
  ]);

  getMaxAppointmentValue(): number {
    return Math.max(...this.appointmentStatusData().map(d => d.value), 1);
  }

  getUtilizationPercentage(current: number, total: number): number {
    if (total === 0) return 0;
    return (current / total) * 100;
  }
}
