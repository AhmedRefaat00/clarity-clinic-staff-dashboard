import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass()">
      <span class="led"></span>
      {{ displayText() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      line-height: 1;
      padding: 5px 10px;
      border-radius: var(--radius-full);
      border: 1px solid transparent;
      text-transform: capitalize;
    }
    .badge .led {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
    .badge-success {
      background-color: var(--bg-success-light);
      color: var(--text-success-dark);
    }
    .badge-warning {
      background-color: var(--bg-warning-light);
      color: var(--text-warning-dark);
    }
    .badge-neutral {
      background-color: #f1f5f4;
      color: #708580;
      border-color: var(--border-color);
    }
  `]
})
export class PaymentBadge {
  status = input<string>('');

  badgeClass = computed(() => {
    const s = this.status().toLowerCase();
    if (s === 'paid') return 'badge-success';
    if (s === 'pending') return 'badge-warning';
    return 'badge-neutral';
  });

  displayText = computed(() => {
    return this.status();
  });
}
