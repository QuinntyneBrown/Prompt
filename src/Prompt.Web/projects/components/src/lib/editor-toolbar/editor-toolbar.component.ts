import { Component, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StatusBadgeComponent, SkillStatus } from '../status-badge/status-badge.component';

export type EditorViewMode = 'editor' | 'split' | 'preview';

@Component({
  selector: 'lib-editor-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    StatusBadgeComponent,
  ],
  template: `
    <mat-toolbar>
      <div class="toolbar-left">
        <button mat-icon-button (click)="back.emit()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <mat-icon class="file-icon">description</mat-icon>
        <span class="file-name">{{ fileName() }}</span>
        @if (status()) {
          <lib-status-badge [status]="status()!" />
        }
      </div>

      <div class="toolbar-right">
        <mat-button-toggle-group [value]="viewMode()" (change)="viewModeChange.emit($event.value)">
          <mat-button-toggle value="editor">Editor</mat-button-toggle>
          <mat-button-toggle value="split">Split</mat-button-toggle>
          <mat-button-toggle value="preview">Preview</mat-button-toggle>
        </mat-button-toggle-group>

        <button mat-flat-button color="primary" (click)="save.emit()">
          Save
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: `
    :host { display: block; }

    mat-toolbar {
      display: flex;
      justify-content: space-between;
      background: var(--bg-toolbar);
      border-bottom: 1px solid var(--border);
      height: 64px;
      padding: 0 24px;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .file-icon {
      color: var(--primary);
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .file-name {
      font-family: var(--font-primary);
      font-size: 18px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    mat-button-toggle-group {
      height: 36px;
    }
  `,
})
export class EditorToolbarComponent {
  fileName = input('untitled.md');
  status = input<SkillStatus | null>(null);
  viewMode = input<EditorViewMode>('split');

  back = output<void>();
  save = output<void>();
  viewModeChange = output<EditorViewMode>();
}
