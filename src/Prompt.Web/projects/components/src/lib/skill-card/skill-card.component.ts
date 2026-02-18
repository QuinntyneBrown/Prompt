import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { StatusBadgeComponent, SkillStatus } from '../status-badge/status-badge.component';

@Component({
  selector: 'lib-skill-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    StatusBadgeComponent,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-icon mat-card-avatar class="file-icon">description</mat-icon>
        <mat-card-title>{{ title() }}</mat-card-title>
        <button mat-icon-button [matMenuTriggerFor]="menu" class="card-menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="edit.emit()">
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
          </button>
          <button mat-menu-item (click)="duplicate.emit()">
            <mat-icon>content_copy</mat-icon>
            <span>Duplicate</span>
          </button>
          <button mat-menu-item class="delete-item" (click)="delete.emit()">
            <mat-icon>delete</mat-icon>
            <span>Delete</span>
          </button>
        </mat-menu>
      </mat-card-header>

      <mat-card-content>
        <p class="description">{{ description() }}</p>
        @if (tags().length) {
          <mat-chip-set>
            @for (tag of tags(); track tag) {
              <mat-chip>{{ tag }}</mat-chip>
            }
          </mat-chip-set>
        }
      </mat-card-content>

      <mat-card-footer>
        <div class="footer">
          <span class="date">{{ date() }}</span>
          <lib-status-badge [status]="status()" />
        </div>
      </mat-card-footer>
    </mat-card>
  `,
  styles: `
    :host { display: block; }

    mat-card {
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    mat-card:hover {
      box-shadow: 0 2px 8px var(--shadow-1), 0 1px 4px var(--shadow-2);
    }

    mat-card-header {
      position: relative;
    }

    .file-icon {
      color: var(--primary);
      background: var(--primary-light);
      border-radius: 8px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .card-menu {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-hint);
    }

    .description {
      font-family: var(--font-primary);
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.45;
      margin: 0 0 10px;
    }

    mat-chip-set {
      display: flex;
      gap: 6px;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      border-top: 1px solid var(--divider);
    }

    .date {
      font-family: var(--font-primary);
      font-size: 11px;
      color: var(--text-hint);
    }

    .delete-item {
      color: var(--warn);
    }
  `,
})
export class SkillCardComponent {
  title = input.required<string>();
  description = input('');
  tags = input<string[]>([]);
  status = input<SkillStatus>('published');
  date = input('');

  edit = output<void>();
  duplicate = output<void>();
  delete = output<void>();
}
