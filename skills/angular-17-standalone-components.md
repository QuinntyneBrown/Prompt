# Angular 17 Standalone Components

> **ROLE**: You are generating Angular 17 components. Follow every rule below exactly. Your output must compile.

> **WHEN TO USE**: Use this skill when asked to create a component, directive, or pipe in Angular 17.

> **OUTPUT FORMAT**: Output a complete TypeScript file with all imports. Do not skip any code with comments like `// ...`.

---

## Step-by-Step: How to Create a Component

Follow these steps in order every time you create a component:

**Step 1.** Add these imports at the top of the file:
```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
```

**Step 2.** Add `standalone: true` to the `@Component` decorator.

**Step 3.** Add `changeDetection: ChangeDetectionStrategy.OnPush` to the decorator.

**Step 4.** List all template dependencies in the `imports` array (other components, directives, pipes, modules like `ReactiveFormsModule`).

**Step 5.** Use `input()` for inputs and `output()` for outputs — never `@Input()` or `@Output()`.

**Step 6.** Use `@if`, `@for`, `@switch` in the template — never `*ngIf`, `*ngFor`, `*ngSwitch`.

---

## WRONG vs RIGHT Examples

### Component Declaration

**WRONG — DO NOT generate this:**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() selected = new EventEmitter<User>();
}
```

**RIGHT — Always generate this:**
```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user(); as u) {
      <div class="card">
        <h3>{{ u.name }}</h3>
        <button (click)="selected.emit(u)">Select</button>
      </div>
    }
  `,
})
export class UserCardComponent {
  user = input.required<User>();
  selected = output<User>();
}
```

---

## Bootstrapping — How to Set Up the App

**main.ts:**
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
```

**app.config.ts:**
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([]), withFetch()),
  ],
};
```

---

## Input/Output Signal API

### Required Input (no default value)
```typescript
user = input.required<User>();
```
The parent component MUST provide this input. Usage: `<app-card [user]="myUser" />`

### Optional Input (with default value)
```typescript
debounceMs = input<number>(300);
```
The parent may or may not provide this. Usage: `<app-search [debounceMs]="500" />`

### Output (event emitter replacement)
```typescript
searchChanged = output<string>();
```
Emit from template: `(click)="searchChanged.emit(value)"`

### Two-Way Binding
```typescript
query = model<string>('');
```
Usage: `<app-search [(query)]="searchTerm" />`

---

## Standalone Directive

```typescript
import { Directive, ElementRef, input, effect } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  color = input<string>('yellow', { alias: 'appHighlight' });

  constructor(private el: ElementRef) {
    effect(() => {
      this.el.nativeElement.style.backgroundColor = this.color();
    });
  }
}
```

---

## Standalone Pipe

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
```

---

## Mandatory Rules — Check Before Returning Code

1. YOU MUST include `standalone: true` in every `@Component`, `@Directive`, and `@Pipe`.
2. YOU MUST include `changeDetection: ChangeDetectionStrategy.OnPush` in every `@Component`.
3. YOU MUST use `input()` and `output()` functions — never `@Input()` or `@Output()` decorators.
4. YOU MUST list all template dependencies in the `imports` array.
5. YOU MUST NOT import `CommonModule` just for `*ngIf` or `*ngFor` — use `@if` and `@for` which need no imports.
6. YOU MUST NOT use `declarations` arrays anywhere — that is the old NgModule pattern.
7. YOU MUST NOT create `SharedModule` or any NgModule.

## Self-Check

Before returning code, verify:
- [ ] `standalone: true` is present
- [ ] `ChangeDetectionStrategy.OnPush` is present
- [ ] `input()` / `output()` used, not decorators
- [ ] Template uses `@if` / `@for`, not `*ngIf` / `*ngFor`
- [ ] All needed imports are in the `imports` array
- [ ] All TypeScript imports at the top are complete
