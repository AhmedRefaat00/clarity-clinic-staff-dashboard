import { Component, inject, signal } from '@angular/core';
import { StaffService } from '../../core/services/staff.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff',
  imports: [CommonModule],
  templateUrl: './staff.html',
  styleUrl: './staff.css',
})
export class Staff {
  private staffService = inject(StaffService)
  staffList = signal<any>(null)
  
  ngOnInit(): void {
    this.staffService.getStaffList().subscribe((data: any) => {
      console.log(data);
      this.staffList.set(data);
    });
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

  toggleStatus(staff: any) {
    const originalState = staff.isActive;
    staff.isActive = !staff.isActive;

    this.staffService.toggleStaffStatus(staff.id).subscribe({
      next: (response: any) => {
      },
      error: (err) => {
        console.error('Failed to toggle status, reverting state:', err);
        staff.isActive = originalState;
      }
    });
  }
}
