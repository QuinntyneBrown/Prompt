# Angular 17 Refactoring — From Ball of Mud to Clean Architecture

> **ROLE**: You are refactoring messy, tangled Angular code ("ball of mud") into clean, modular, testable Angular 17 code. Follow every step below exactly. Do not skip steps.

> **WHEN TO USE**: Use this skill when the user asks to refactor, clean up, restructure, untangle, or modernize existing Angular code. Also use when code has these symptoms:
> - Large components with 200+ lines
> - Components that call HTTP directly
> - Business logic mixed into templates
> - Services that do too many things
> - No tests or untestable code
> - `*ngIf`, `*ngFor`, NgModules, constructor injection, or other legacy patterns

> **OUTPUT FORMAT**: For each file you refactor, output the COMPLETE new file. Include all imports. Do not output partial code. Label each file with its path and whether it is a Container, Presentational, Service, Guard, etc.

---

## Step-by-Step Refactoring Process

Follow these steps IN ORDER. Do not skip steps or combine them.

### Step 1: Identify the Problems

Read the existing code and list every problem you find. Common problems:

| Symptom | Problem | Fix |
|---------|---------|-----|
| Component calls `this.http.get()` directly | HTTP logic in component | Extract to API service |
| Component has 200+ lines of TypeScript | God component | Split into container + presentational |
| Component has complex `if/else` chains in TypeScript | Business logic in component | Move to service |
| `*ngIf`, `*ngFor` in template | Legacy syntax | Replace with `@if`, `@for` |
| `@NgModule` exists | Legacy module system | Convert to standalone |
| `constructor(private svc: Service)` | Constructor injection | Replace with `inject()` |
| `@Input()`, `@Output()` decorators | Legacy input/output | Replace with `input()`, `output()` |
| No `ChangeDetectionStrategy.OnPush` | Default change detection | Add OnPush |
| `BehaviorSubject` for simple state | Over-use of RxJS | Replace with `signal()` |
| Manual `subscribe/unsubscribe` | Memory leak risk | Use `takeUntilDestroyed()` or `toSignal()` |
| Component directly uses `localStorage` | Side-effect in component | Extract to service |
| No `.spec.ts` files | Not testable | Add tests after refactoring |

### Step 2: Extract Interfaces and Models

Create TypeScript interfaces for all data shapes. Put them in `models/`.

**Before (types mixed into components):**
```typescript
// Bad — data shape defined nowhere
this.http.get('/api/users').subscribe((data: any) => { ... });
```

**After (explicit interface):**
```typescript
// models/user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}
```

### Step 3: Extract API Services

Move ALL HTTP calls out of components and into dedicated API services.

**Before (HTTP in component — BAD):**
```typescript
@Component({ ... })
export class UserListComponent {
  users: any[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/api/users').subscribe(data => {
      this.users = data;
    });
  }

  deleteUser(id: string) {
    this.http.delete(`/api/users/${id}`).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
    });
  }
}
```

**After (HTTP in service — GOOD):**
```typescript
// services/user-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
```

### Step 4: Extract State Services

Move all state management out of components and into state services that use signals.

**After (state in service — GOOD):**
```typescript
// services/user.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { UserApiService } from './user-api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(UserApiService);

  private readonly _users = signal<User[]>([]);
  private readonly _isLoading = signal(false);

  readonly users = this._users.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly activeUsers = computed(() => this._users().filter(u => u.isActive));

  loadUsers(): void {
    this._isLoading.set(true);
    this.api.getAll().subscribe({
      next: (users) => {
        this._users.set(users);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }

  deleteUser(id: string): void {
    this.api.delete(id).subscribe(() => {
      this._users.update(users => users.filter(u => u.id !== id));
    });
  }
}
```

### Step 5: Split God Components into Container + Presentational

Take the original component and split it into two:

1. **Container** — injects the service, passes data down, handles events
2. **Presentational** — receives data via `input()`, emits events via `output()`

**Container (pages/users/users-page.component.ts):**
```typescript
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Users</h1>
    @if (userService.isLoading()) {
      <app-spinner />
    } @else {
      <app-user-list
        [users]="userService.users()"
        (userDeleted)="onDelete($event)"
      />
    }
  `,
})
export class UsersPageComponent {
  protected userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    this.userService.loadUsers();
  }

  onDelete(user: User): void {
    this.userService.deleteUser(user.id);
  }
}
```

**Presentational (components/user-list/user-list.component.ts):**
```typescript
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (user of users(); track user.id) {
      <div class="user-row">
        <span>{{ user.name }}</span>
        <button (click)="userDeleted.emit(user)">Delete</button>
      </div>
    } @empty {
      <p>No users found.</p>
    }
  `,
})
export class UserListComponent {
  users = input.required<User[]>();
  userDeleted = output<User>();
}
```

### Step 6: Convert Legacy Patterns

Apply these replacements to all remaining code:

| Find this | Replace with |
|-----------|-------------|
| `@NgModule({ ... })` | Delete the module. Add `standalone: true` to all components. |
| `constructor(private svc: Service)` | `private svc = inject(Service);` |
| `@Input() prop: Type` | `prop = input<Type>()` or `prop = input.required<Type>()` |
| `@Output() event = new EventEmitter()` | `event = output<Type>()` |
| `*ngIf="cond"` | `@if (cond) { }` |
| `*ngFor="let x of list"` | `@for (x of list; track x.id) { }` |
| `*ngSwitch` | `@switch (val) { @case (v) { } }` |
| `new BehaviorSubject(val)` | `signal(val)` |
| `.subscribe()` without cleanup | Add `.pipe(takeUntilDestroyed())` |
| Missing `ChangeDetectionStrategy` | Add `changeDetection: ChangeDetectionStrategy.OnPush` |

### Step 7: Add Tests

After refactoring, write tests for every new file. Follow the patterns in `angular-17-testing.md`.

Minimum tests to write:
- **API Service**: Mock `HttpClient`, test each method
- **State Service**: Test signal values after each mutation
- **Container Component**: Mock the service, test that it calls the right methods
- **Presentational Component**: Set inputs, check template output, test output emissions

---

## Refactoring Checklist — Verify the Result

After refactoring, every item below MUST be true:

**Architecture:**
- [ ] No component calls `HttpClient` directly — all HTTP is in API services
- [ ] No component contains business logic — it is in state services
- [ ] No god components over 100 lines — split into container + presentational
- [ ] Every component is either a container OR presentational, not both
- [ ] File structure follows: `pages/`, `components/`, `shared/`, `services/`, `models/`

**Angular 17 Patterns:**
- [ ] All components have `standalone: true`
- [ ] All components have `ChangeDetectionStrategy.OnPush`
- [ ] All inputs use `input()`, all outputs use `output()`
- [ ] All templates use `@if`, `@for`, `@switch`
- [ ] All DI uses `inject()`, not constructor parameters
- [ ] State uses `signal()` and `computed()`, not `BehaviorSubject`
- [ ] All subscriptions use `takeUntilDestroyed()` or `toSignal()`

**Testability:**
- [ ] Presentational components can be tested with just inputs and outputs
- [ ] Services can be tested by mocking their dependencies
- [ ] No hidden dependencies — everything is injected explicitly
- [ ] No tight coupling between components and services

**No Legacy Code:**
- [ ] No `@NgModule` anywhere
- [ ] No `@Input()` or `@Output()` decorators
- [ ] No `*ngIf`, `*ngFor`, `*ngSwitch`
- [ ] No constructor parameter injection
- [ ] No manual `Subscription` management
- [ ] No `any` types
