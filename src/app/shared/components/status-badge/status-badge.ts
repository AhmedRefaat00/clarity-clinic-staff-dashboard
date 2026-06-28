import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
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
    .badge-accent {
      background-color: var(--primary-light);
      color: var(--primary-color);
    }
    .badge-success {
      background-color: var(--bg-success-light);
      color: var(--text-success-dark);
    }
    .badge-warning {
      background-color: var(--bg-warning-light);
      color: var(--text-warning-dark);
    }
    .badge-danger {
      background-color: var(--bg-danger-light);
      color: var(--text-danger-dark);
    }
    .badge-neutral {
      background-color: #f1f5f4;
      color: #708580;
      border-color: var(--border-color);
    }
    .dark-theme .badge-neutral {
      background-color: #1a302c;
      color: #8ba39c;
      border-color: var(--border-color);
    }
  `]
})
export class StatusBadge {
  status = input<string>('');

  badgeClass = computed(() => {
    const s = this.status().toLowerCase().replace('-', '').replace(' ', '');
    if (s === 'confirmed' || s === 'completed') return 'badge-success';
    if (s === 'arrived') return 'badge-accent';
    if (s === 'pendingpayment' || s === 'awaitingpayment') return 'badge-warning';
    if (s === 'noshow' || s === 'cancelled') return 'badge-danger';
    return 'badge-neutral';
  });

  displayText = computed(() => {
    const s = this.status();
    if (s === 'NoShow') return 'No-show';
    if (s === 'PendingPayment') return 'Pending payment';
    return s;
  });
}
