import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

export type MarkdownAction =
  | 'heading'
  | 'bold'
  | 'italic'
  | 'code'
  | 'link'
  | 'bullet-list'
  | 'numbered-list'
  | 'quote'
  | 'undo'
  | 'redo';

@Component({
  selector: 'lib-markdown-toolbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatDividerModule],
  template: `
    <div class="md-toolbar">
      <button mat-icon-button matTooltip="Heading" (click)="action.emit('heading')">
        <span class="text-btn">H</span>
      </button>
      <button mat-icon-button matTooltip="Bold" (click)="action.emit('bold')">
        <mat-icon>format_bold</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Italic" (click)="action.emit('italic')">
        <mat-icon>format_italic</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Code" (click)="action.emit('code')">
        <mat-icon>code</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Link" (click)="action.emit('link')">
        <mat-icon>link</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Bullet List" (click)="action.emit('bullet-list')">
        <mat-icon>format_list_bulleted</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Numbered List" (click)="action.emit('numbered-list')">
        <mat-icon>format_list_numbered</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Quote" (click)="action.emit('quote')">
        <mat-icon>format_quote</mat-icon>
      </button>

      <mat-divider [vertical]="true" />

      <button mat-icon-button matTooltip="Undo" (click)="action.emit('undo')">
        <mat-icon>undo</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Redo" (click)="action.emit('redo')">
        <mat-icon>redo</mat-icon>
      </button>
    </div>
  `,
  styles: `
    :host { display: block; }

    .md-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 12px;
      height: 44px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--divider);
    }

    .text-btn {
      font-family: var(--font-primary);
      font-size: 16px;
      font-weight: 700;
      color: var(--text-secondary);
    }

    button {
      width: 34px;
      height: 34px;
      color: var(--text-secondary);
    }

    mat-divider {
      height: 24px;
      margin: 0 4px;
    }
  `,
})
export class MarkdownToolbarComponent {
  action = output<MarkdownAction>();
}
