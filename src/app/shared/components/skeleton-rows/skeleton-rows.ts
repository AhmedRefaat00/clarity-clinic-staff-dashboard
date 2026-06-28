import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-rows',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-rows.html',
  styleUrl: './skeleton-rows.css'
})
export class SkeletonRows {
  count = input<number>(5);

  getRowsArray() {
    return Array(this.count() || 5).fill(0);
  }
}
