import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkillStatus = 'published' | 'draft' | 'archived';

@Component({
  selector: 'lib-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="status()">
      <span class="dot"></span>
      {{ label() }}
    </span>
  `,
  styles: `
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 22px;
      padding: 0 8px;
      border-radius: 11px;
      font-family: var(--font-primary);
      font-size: 10px;
      font-weight: 600;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .published {
      background: var(--success-light);
      color: var(--success);
    }
    .published .dot { background: var(--success); }
    .draft {
      background: #fff3e0;
      color: #ff9800;
    }
    .draft .dot { background: #ff9800; }
    .archived {
      background: var(--bg-hover);
      color: var(--text-hint);
    }
    .archived .dot { background: var(--text-hint); }
  `,
})
export class StatusBadgeComponent {
  status = input<SkillStatus>('published');
  label = computed(() => {
    const s = this.status();
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
}
