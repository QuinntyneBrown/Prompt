# Angular 17 Component Architecture

> **ROLE**: You are structuring Angular 17 applications. When creating components, you MUST decide if each one is a "container" or "presentational" component and follow the rules for that type.

> **WHEN TO USE**: Use this skill when the user asks to create a page, feature, or multiple components that work together.

> **OUTPUT FORMAT**: Output complete component files. Label each file clearly as "Container" or "Presentational" in a comment.

---

## Two Types of Components — Learn the Difference

### Container Component (Smart)
- Lives in `pages/` folder
- Injects services using `inject()`
- Manages state and calls APIs
- Passes data DOWN to child components via `[input]`
- Handles events FROM child components via `(output)`
- Has a thin template that mostly contains child component tags

### Presentational Component (Dumb)
- Lives in `components/` or `shared/` folder
- Has ZERO `inject()` calls — no services at all
- Receives ALL data through `input()` signals
- Sends ALL events through `output()` emitters
- Can be tested with just inputs and outputs — no mocking needed
- Is reusable across multiple pages

---

## Quick Reference Table

| Question                          | Container             | Presentational         |
|-----------------------------------|-----------------------|------------------------|
| Does it inject services?          | YES                   | NO                     |
| Does it call APIs?                | YES                   | NO                     |
| Does it use `input()`?            | Rarely                | YES, for all data      |
| Does it use `output()`?           | Rarely                | YES, for all events    |
| Does it handle navigation?        | YES                   | NO                     |
| Is it reusable across pages?      | NO, page-specific     | YES                    |
| How to test it?                   | Mock services         | Just set inputs        |

---

## WRONG vs RIGHT

**WRONG — Presentational component that injects a service:**
```typescript
@Component({ ... })
export class UserListComponent {
  private userService = inject(UserService); // WRONG for a presentational component
  users = this.userService.users;

  onDelete(id: string) {
    this.userService.deleteUser(id); // WRONG — business logic in presentational
  }
}
```

**RIGHT — Presentational component with inputs and outputs:**
```typescript
@Component({ ... })
export class UserListComponent {
  users = input.required<User[]>();       // data comes from parent
  userDeleted = output<User>();           // events go to parent

  // NO inject() calls. NO service calls.
}
```

---

## Pattern: Container Component

```typescript
// pages/users/users-page.component.ts — CONTAINER
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent, UserFilterComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Users</h1>

    <app-user-filter
      [currentFilter]="userService.filter()"
      (filterChanged)="userService.setFilter($event)"
    />

    @if (userService.isLoading()) {
      <app-spinner />
    } @else {
      <app-user-list
        [users]="userService.filteredUsers()"
        (userSelected)="onUserSelected($event)"
        (userDeleted)="onUserDeleted($event)"
      />
    }
  `,
})
export class UsersPageComponent {
  protected userService = inject(UserService);  // Container CAN inject services
  private router = inject(Router);              // Container CAN use router

  constructor() {
    this.userService.loadUsers();
  }

  onUserSelected(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  onUserDeleted(user: User): void {
    this.userService.deleteUser(user.id);
  }
}
```

---

## Pattern: Presentational Component

```typescript
// components/user-list/user-list.component.ts — PRESENTATIONAL
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (user of users(); track user.id) {
      <div class="user-row">
        <span>{{ user.name }}</span>
        <span>{{ user.email }}</span>
        <div class="actions">
          <button (click)="userSelected.emit(user)">View</button>
          <button (click)="userDeleted.emit(user)">Delete</button>
        </div>
      </div>
    } @empty {
      <p>No users found.</p>
    }
  `,
})
export class UserListComponent {
  // ALL data comes from inputs
  users = input.required<User[]>();

  // ALL actions go through outputs
  userSelected = output<User>();
  userDeleted = output<User>();

  // ZERO inject() calls — this is presentational
}
```

---

## File Structure

```
src/app/
├── pages/                     # Container components (one per route)
│   ├── users/
│   │   ├── users-page.component.ts
│   │   └── users-page.component.spec.ts
│   └── dashboard/
│       ├── dashboard-page.component.ts
│       └── dashboard-page.component.spec.ts
├── components/                # Presentational components (reusable)
│   ├── user-list/
│   ├── user-card/
│   └── user-filter/
├── shared/                    # Cross-cutting presentational (spinner, modal)
├── services/                  # Business logic and state
├── guards/                    # Functional route guards
├── interceptors/              # Functional HTTP interceptors
├── models/                    # TypeScript interfaces
└── app.config.ts
```

### Rules:
- YOU MUST put route-level (page) components in `pages/`.
- YOU MUST put reusable UI components in `components/`.
- YOU MUST put cross-cutting UI (spinner, modal, etc.) in `shared/`.
- YOU MUST put business logic in `services/`.

---

## Self-Check

Before returning code, verify:
- [ ] Page-level components are containers — they inject services
- [ ] Reusable UI components are presentational — they use `input()` and `output()` only
- [ ] Presentational components have ZERO `inject()` calls for services
- [ ] Both types have `standalone: true` and `ChangeDetectionStrategy.OnPush`
- [ ] Container templates are mostly child component tags
- [ ] No service injection in presentational components
