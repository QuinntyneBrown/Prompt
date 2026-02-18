import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';

export interface NavCategory {
  icon: string;
  label: string;
  count?: number;
}

export interface NavTag {
  label: string;
  color: string;
}

@Component({
  selector: 'lib-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    MatButtonModule,
  ],
  template: `
    <div class="sidenav">
      <div class="section-header">CATEGORIES</div>
      <mat-nav-list>
        @for (cat of categories(); track cat.label; let i = $index) {
          <a mat-list-item
             [activated]="i === activeCategoryIndex()"
             (click)="categorySelect.emit(i)">
            <mat-icon matListItemIcon>{{ cat.icon }}</mat-icon>
            <span matListItemTitle>{{ cat.label }}</span>
            @if (cat.count !== undefined) {
              <span matListItemMeta class="badge">{{ cat.count }}</span>
            }
          </a>
        }
      </mat-nav-list>

      <mat-divider />

      <div class="section-header tags-header">
        <span>TAGS</span>
        <button mat-icon-button class="add-btn" (click)="addTag.emit()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <mat-nav-list>
        @for (tag of tags(); track tag.label) {
          <a mat-list-item (click)="tagSelect.emit(tag.label)">
            <span matListItemIcon class="tag-dot" [style.background]="tag.color"></span>
            <span matListItemTitle>{{ tag.label }}</span>
          </a>
        }
      </mat-nav-list>
    </div>
  `,
  styles: `
    :host { display: block; }

    .sidenav {
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      height: 100%;
      padding: 16px 0;
      width: 280px;
      overflow-y: auto;
    }

    .section-header {
      font-family: var(--font-primary);
      font-size: 11px;
      font-weight: 600;
      color: var(--text-hint);
      letter-spacing: 1.5px;
      padding: 8px 16px;
    }

    .tags-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px 8px;
    }

    .add-btn {
      width: 28px;
      height: 28px;
      color: var(--text-hint);
    }

    .badge {
      background: var(--primary);
      color: var(--text-on-primary);
      border-radius: 11px;
      min-width: 28px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
    }

    .tag-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    mat-divider {
      margin: 4px 0;
    }
  `,
})
export class SidenavComponent {
  categories = input<NavCategory[]>([
    { icon: 'folder', label: 'All Skills', count: 12 },
    { icon: 'edit_note', label: 'Drafts' },
    { icon: 'check_circle', label: 'Published' },
    { icon: 'archive', label: 'Archived' },
  ]);
  tags = input<NavTag[]>([
    { label: 'Angular', color: '#1976D2' },
    { label: 'TypeScript', color: '#4CAF50' },
    { label: 'Prompting', color: '#FF9800' },
    { label: 'CLI Tools', color: '#9C27B0' },
  ]);
  activeCategoryIndex = input(0);

  categorySelect = output<number>();
  tagSelect = output<string>();
  addTag = output<void>();
}
