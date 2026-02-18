import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatChipInputEvent } from '@angular/material/chips';

export interface SkillFormData {
  name: string;
  description: string;
  template: string;
  tags: string[];
}

export interface SkillFormDialogInput {
  title?: string;
  templates?: string[];
  data?: Partial<SkillFormData>;
}

@Component({
  selector: 'lib-skill-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ dialogInput?.title || 'New Skill' }}</h2>

    <mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Skill Name</mat-label>
        <input matInput [(ngModel)]="formData.name" placeholder="e.g. commit-message" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Template</mat-label>
        <mat-select [(ngModel)]="formData.template">
          @for (t of templates; track t) {
            <mat-option [value]="t">{{ t }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="formData.description"
                  rows="3"
                  placeholder="Describe what this skill does..."></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Tags</mat-label>
        <mat-chip-grid #chipGrid>
          @for (tag of formData.tags; track tag) {
            <mat-chip-row (removed)="removeTag(tag)">
              {{ tag }}
              <mat-icon matChipRemove>close</mat-icon>
            </mat-chip-row>
          }
        </mat-chip-grid>
        <input matInput
               [matChipInputFor]="chipGrid"
               placeholder="Add tag..."
               (matChipInputTokenEnd)="addTag($event)" />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="save()">
        {{ dialogInput?.data ? 'Save' : 'Create Skill' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 400px;
    }

    mat-form-field {
      width: 100%;
    }

    @media (max-width: 599px) {
      mat-dialog-content {
        min-width: unset;
      }
    }
  `,
})
export class SkillFormDialogComponent {
  private dialogRef = inject(MatDialogRef<SkillFormDialogComponent>);
  dialogInput = inject<SkillFormDialogInput | null>(MAT_DIALOG_DATA, { optional: true });

  templates = this.dialogInput?.templates || ['Blank', 'Conventional', 'Semantic', 'Custom'];

  formData: SkillFormData = {
    name: this.dialogInput?.data?.name || '',
    description: this.dialogInput?.data?.description || '',
    template: this.dialogInput?.data?.template || 'Blank',
    tags: [...(this.dialogInput?.data?.tags || [])],
  };

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.formData.tags.push(value);
    }
    event.chipInput.clear();
  }

  removeTag(tag: string): void {
    const idx = this.formData.tags.indexOf(tag);
    if (idx >= 0) {
      this.formData.tags.splice(idx, 1);
    }
  }

  save(): void {
    this.dialogRef.close(this.formData);
  }
}
