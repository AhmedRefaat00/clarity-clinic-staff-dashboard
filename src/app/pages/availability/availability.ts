import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

interface Shift {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface BlockedDate {
  date: string;
}

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyState],
  templateUrl: './availability.html',
  styleUrl: './availability.css'
})
export class Availability {
  doctors = signal([
    { id: '1', displayName: 'Dr. Ahmed Ali' },
    { id: '2', displayName: 'Dr. Sarah Connor' },
    { id: '3', displayName: 'Dr. John Watson' },
    { id: '4', displayName: 'Dr. Gregory House' }
  ]);

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  doctorId = signal('');
  rows = signal<Shift[]>([]);
  blockedDates = signal<BlockedDate[]>([]);
  blockDate = signal('');
  saving = signal(false);

  // Mock database mapping doctor ID to shifts and blocked dates
  mockAvailability: Record<string, { shifts: Shift[]; blocked: BlockedDate[] }> = {
    '1': {
      shifts: [
        { dayOfWeek: 'Sunday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '15:00' }
      ],
      blocked: [{ date: '2026-07-04' }, { date: '2026-07-11' }]
    },
    '2': {
      shifts: [
        { dayOfWeek: 'Monday', startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '18:00' }
      ],
      blocked: []
    },
    '3': {
      shifts: [
        { dayOfWeek: 'Sunday', startTime: '08:00', endTime: '14:00' },
        { dayOfWeek: 'Thursday', startTime: '12:00', endTime: '20:00' }
      ],
      blocked: [{ date: '2026-07-10' }]
    },
    '4': {
      shifts: [
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00' }
      ],
      blocked: []
    }
  };

  constructor() {
    // When doctorId changes, load their availability rows and blocked dates
    effect(() => {
      const docId = this.doctorId();
      if (docId && this.mockAvailability[docId]) {
        const data = this.mockAvailability[docId];
        this.rows.set(JSON.parse(JSON.stringify(data.shifts)));
        this.blockedDates.set(JSON.parse(JSON.stringify(data.blocked)));
      } else {
        this.rows.set([]);
        this.blockedDates.set([]);
      }
    });
  }

  addRow(): void {
    this.rows.update(r => [...r, { dayOfWeek: 'Sunday', startTime: '09:00', endTime: '17:00' }]);
  }

  removeRow(index: number): void {
    this.rows.update(r => r.filter((_, i) => i !== index));
  }

  updateRow(index: number, field: keyof Shift, value: string): void {
    this.rows.update(list => list.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }

  save(): void {
    const docId = this.doctorId();
    if (!docId) return;

    this.saving.set(true);
    setTimeout(() => {
      // Save locally
      this.mockAvailability[docId].shifts = JSON.parse(JSON.stringify(this.rows()));
      this.saving.set(false);
      alert('Availability settings saved successfully!');
    }, 400);
  }

  addBlocked(): void {
    const docId = this.doctorId();
    const dateVal = this.blockDate();
    if (!docId || !dateVal) return;

    // Check if already blocked
    if (this.blockedDates().some(b => b.date === dateVal)) {
      this.blockDate.set('');
      return;
    }

    const newBlocked = { date: dateVal };
    this.blockedDates.update(list => [...list, newBlocked]);
    this.mockAvailability[docId].blocked.push(newBlocked);
    this.blockDate.set('');
  }

  removeBlocked(date: string): void {
    const docId = this.doctorId();
    if (!docId) return;

    this.blockedDates.update(list => list.filter(b => b.date !== date));
    this.mockAvailability[docId].blocked = this.mockAvailability[docId].blocked.filter(b => b.date !== date);
  }
}
