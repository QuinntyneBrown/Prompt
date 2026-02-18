import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteConfirmData {
  fileName: string;
  message?: string;
}

@Component({
  selector: 'lib-delete-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-content">
      <div class="icon-frame">
        <mat-icon>delete</mat-icon>
      </div>

      <h2>Delete Skill?</h2>

      <p class="message">
        {{ data?.message || defaultMessage }}
      </p>

      <div class="file-info">
        <mat-icon class="file-icon">description</mat-icon>
        <span class="file-name">{{ data?.fileName || 'file.md' }}</span>
      </div>

      <div class="actions">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-flat-button class="delete-btn" (click)="confirm()">
          Delete
        </button>
      </div>
    </div>
  `,
  styles: `
    .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 28px 24px 20px;
      text-align: center;
    }

    .icon-frame {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: #ffebee;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-frame mat-icon {
      color: var(--warn);
      font-size: 24px;
    }

    h2 {
      margin: 0;
      font-family: var(--font-primary);
      font-size: 20px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .message {
      margin: 0;
      font-family: var(--font-primary);
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px;
      background: var(--bg-hover);
      border-radius: var(--radius-md);
      width: 100%;
    }

    .file-icon {
      color: var(--warn);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .file-name {
      font-family: var(--font-primary);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      width: 100%;
      padding-top: 8px;
    }

    .delete-btn {
      background: var(--warn) !important;
      color: var(--text-on-primary) !important;
    }
  `,
})
export class DeleteConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<DeleteConfirmDialogComponent>);
  data = inject<DeleteConfirmData | null>(MAT_DIALOG_DATA, { optional: true });

  defaultMessage = `Are you sure you want to delete ${this.data?.fileName || 'this file'}? This action cannot be undone and all content will be permanently removed.`;

  confirm(): void {
    this.dialogRef.close(true);
  }
}
