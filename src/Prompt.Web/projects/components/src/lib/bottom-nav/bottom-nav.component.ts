import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export interface BottomNavItem {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'lib-bottom-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  template: `
    <nav class="bottom-nav">
      @for (item of items(); track item.label; let i = $index) {
        <button class="nav-item"
                [class.active]="i === activeIndex()"
                matRipple
                (click)="navigate.emit(i)">
          <mat-icon>{{ item.icon }}</mat-icon>
          <span class="label">{{ item.label }}</span>
        </button>
      }
    </nav>
  `,
  styles: `
    :host { display: block; }

    .bottom-nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: var(--bg-surface);
      border-top: 1px solid var(--border);
      height: 64px;
      padding: 0 8px;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px 0;
      width: 72px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--text-hint);
    }

    .nav-item.active {
      color: var(--primary);
    }

    .nav-item.active .label {
      font-weight: 600;
    }

    .label {
      font-family: var(--font-primary);
      font-size: 11px;
    }
  `,
})
export class BottomNavComponent {
  items = input<BottomNavItem[]>([
    { icon: 'folder', label: 'Skills' },
    { icon: 'edit_note', label: 'Drafts' },
    { icon: 'sell', label: 'Tags' },
    { icon: 'settings', label: 'Settings' },
  ]);
  activeIndex = input(0);
  navigate = output<number>();
}
