import { Component, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar>
      <div class="toolbar-left">
        @if (showMenuButton()) {
          <button mat-icon-button (click)="menuClick.emit()">
            <mat-icon>menu</mat-icon>
          </button>
        }
        <mat-icon class="logo-icon">description</mat-icon>
        <span class="logo-text">{{ title() }}</span>
      </div>
      <div class="toolbar-right">
        <ng-content />
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
      gap: 12px;
    }

    .logo-icon {
      color: var(--primary);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .logo-text {
      font-family: var(--font-primary);
      font-size: 20px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  `,
})
export class AppToolbarComponent {
  title = input('Skill Editor');
  showMenuButton = input(false);
  menuClick = output<void>();
}
