import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

export interface FileItem {
  name: string;
  icon?: string;
}

@Component({
  selector: 'lib-file-tree',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatButtonModule],
  template: `
    <div class="file-tree">
      <div class="tree-header">
        <span class="title">{{ sectionTitle() }}</span>
        <button mat-icon-button class="add-btn" (click)="add.emit()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <mat-nav-list dense>
        @for (file of files(); track file.name; let i = $index) {
          <a mat-list-item
             [activated]="i === activeIndex()"
             (click)="fileSelect.emit(i)">
            <mat-icon matListItemIcon>{{ file.icon || 'description' }}</mat-icon>
            <span matListItemTitle>{{ file.name }}</span>
          </a>
        }
      </mat-nav-list>
    </div>
  `,
  styles: `
    :host { display: block; }

    .file-tree {
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      height: 100%;
      width: 260px;
      padding: 12px 0;
      overflow-y: auto;
    }

    .tree-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 16px 12px;
    }

    .title {
      font-family: var(--font-primary);
      font-size: 11px;
      font-weight: 600;
      color: var(--text-hint);
      letter-spacing: 1.5px;
    }

    .add-btn {
      width: 28px;
      height: 28px;
      color: var(--text-hint);
    }
  `,
})
export class FileTreeComponent {
  sectionTitle = input('SKILL FILES');
  files = input<FileItem[]>([]);
  activeIndex = input(0);

  fileSelect = output<number>();
  add = output<void>();
}
