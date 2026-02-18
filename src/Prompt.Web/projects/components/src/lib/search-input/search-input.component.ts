import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-search-input',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput
             [placeholder]="placeholder()"
             [(ngModel)]="value"
             (ngModelChange)="searchChange.emit($event)" />
    </mat-form-field>
  `,
  styles: `
    :host { display: block; }
    mat-form-field { width: 100%; }
    mat-icon { color: var(--text-hint); margin-right: 8px; }
  `,
})
export class SearchInputComponent {
  placeholder = input('Search skills...');
  value = model('');
  searchChange = output<string>();
}
