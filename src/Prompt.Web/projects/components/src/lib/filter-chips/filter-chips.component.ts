import { Component, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'lib-filter-chips',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip-listbox (change)="selectionChange.emit($event.value)">
      @for (option of options(); track option; let i = $index) {
        <mat-chip-option [value]="option" [selected]="i === selectedIndex()">
          {{ option }}
        </mat-chip-option>
      }
    </mat-chip-listbox>
  `,
  styles: `
    :host { display: block; }

    mat-chip-listbox {
      display: flex;
      gap: 8px;
      padding: 0 16px;
    }
  `,
})
export class FilterChipsComponent {
  options = input<string[]>(['All', 'Drafts', 'Published', 'Archived']);
  selectedIndex = input(0);
  selectionChange = output<string>();
}
