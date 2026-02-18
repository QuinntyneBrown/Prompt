import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-fab',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <button mat-fab [color]="color()" (click)="fabClick.emit()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
  styles: `
    :host {
      position: fixed;
      bottom: 80px;
      right: 16px;
      z-index: 100;
    }
  `,
})
export class FabComponent {
  icon = input('add');
  color = input<string>('primary');
  fabClick = output<void>();
}
