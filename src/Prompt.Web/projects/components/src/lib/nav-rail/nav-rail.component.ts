import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export interface NavRailItem {
  icon: string;
  label: string;
}

@Component({
  selector: 'lib-nav-rail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  template: `
    <nav class="nav-rail">
      @for (item of items(); track item.label; let i = $index) {
        <button class="rail-item"
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

    .nav-rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 72px;
      padding: 12px 0;
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      height: 100%;
    }

    .rail-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 0;
      width: 56px;
      border: none;
      background: transparent;
      border-radius: var(--radius-lg);
      cursor: pointer;
      color: var(--text-hint);
    }

    .rail-item:hover {
      background: var(--bg-hover);
    }

    .rail-item.active {
      color: var(--primary);
      background: var(--primary-light);
    }

    .label {
      font-family: var(--font-primary);
      font-size: 11px;
    }
  `,
})
export class NavRailComponent {
  items = input<NavRailItem[]>([
    { icon: 'folder', label: 'Skills' },
    { icon: 'edit_note', label: 'Drafts' },
    { icon: 'check_circle', label: 'Published' },
    { icon: 'archive', label: 'Archived' },
  ]);
  activeIndex = input(0);
  navigate = output<number>();
}
