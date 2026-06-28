import { Component, input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  imports: [],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.css',
})
export class SummaryCard {
  title = input<string>();
  icon = input<string>();
  value = input<string | number>();
  suffix = input<string>();
}
