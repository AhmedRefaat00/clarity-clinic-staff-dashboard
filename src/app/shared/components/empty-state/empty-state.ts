import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css'
})
export class EmptyState {
  icon = input<string>('');
  title = input<string>('');
  message = input<string>('');
}
