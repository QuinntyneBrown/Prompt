import { Component, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-tag-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
  template: `
    <mat-chip-option
      [selected]="selected()"
      [removable]="removable()"
      (removed)="removed.emit()"
      [color]="color()">
      {{ label() }}
      @if (removable()) {
        <mat-icon matChipRemove>close</mat-icon>
      }
    </mat-chip-option>
  `,
  styles: `
    :host { display: inline-block; }
  `,
})
export class TagChipComponent {
  label = input.required<string>();
  color = input<string>('primary');
  selected = input(false);
  removable = input(false);
  removed = output<void>();
}
