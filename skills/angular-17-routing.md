# Angular 17 Routing

> **ROLE**: You are generating Angular 17 routing code. All routes MUST be lazy-loaded. All guards MUST be functions. Follow every rule below.

> **WHEN TO USE**: Use this skill when the user asks about routing, navigation, route guards, resolvers, or lazy loading.

> **OUTPUT FORMAT**: Output complete TypeScript files with all imports.

---

## Critical Rules

- YOU MUST use `loadComponent` or `loadChildren` for every route. Never import components eagerly.
- YOU MUST write guards as functions (`CanActivateFn`), not classes.
- YOU MUST write resolvers as functions (`ResolveFn`), not classes.
- YOU MUST use `inject()` inside guard/resolver functions for dependencies.

**WRONG — DO NOT generate this:**
```typescript
import { UsersComponent } from './users.component';
{ path: 'users', component: UsersComponent }
```

**RIGHT — Always generate this:**
```typescript
{ path: 'users', loadComponent: () => import('./users.component').then(m => m.UsersComponent) }
```

**WRONG — DO NOT generate this:**
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() { ... }
}
```

**RIGHT — Always generate this:**
```typescript
export const authGuard: CanActivateFn = () => { ... };
```

---

## Pattern: Top-Level Route Configuration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('admin')],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
```

---

## Pattern: Child Routes (Lazy-Loaded)

```typescript
// pages/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { userResolver } from '../../resolvers/user.resolver';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./user-detail/user-detail.component').then(m => m.UserDetailComponent),
        resolve: { user: userResolver },
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
```

---

## Pattern: Auth Guard (Function)

```typescript
// guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

---

## Pattern: Role Guard (Higher-Order Function)

A function that returns a guard. Use this when the guard needs a parameter.

```typescript
// guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(requiredRole: string): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasRole(requiredRole)) {
      return true;
    }
    return router.createUrlTree(['/forbidden']);
  };
}

// Usage in routes:
canActivate: [roleGuard('admin')]
```

---

## Pattern: Unsaved Changes Guard

```typescript
// guards/unsaved-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges()) {
    return window.confirm('You have unsaved changes. Leave anyway?');
  }
  return true;
};
```

---

## Pattern: Functional Resolver

```typescript
// resolvers/user.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id')!;
  return userService.getById(id);
};
```

---

## Pattern: Reading Route Data in Components

Use `toSignal()` to convert route observables to signals:

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({ ... })
export class UserDetailComponent {
  private route = inject(ActivatedRoute);

  user = toSignal(this.route.data.pipe(map(d => d['user'] as User)));
  userId = toSignal(this.route.paramMap.pipe(map(p => p.get('id'))));
  tab = toSignal(this.route.queryParamMap.pipe(map(p => p.get('tab') ?? 'overview')));
}
```

---

## Pattern: Bind Route Params to Component Inputs

Enable in `app.config.ts`:
```typescript
import { provideRouter, withComponentInputBinding } from '@angular/router';

providers: [
  provideRouter(routes, withComponentInputBinding()),
]
```

Then the component receives route params as inputs automatically:
```typescript
// Route: { path: 'users/:id', ... }
@Component({ ... })
export class UserDetailComponent {
  id = input.required<string>(); // automatically bound from :id
}
```

---

## Self-Check

Before returning routing code, verify:
- [ ] All routes use `loadComponent` or `loadChildren` — no eager imports
- [ ] Guards are exported `const` functions typed as `CanActivateFn`
- [ ] Guards use `inject()` for dependencies
- [ ] Guards return `router.createUrlTree()` for redirects (not `router.navigate()`)
- [ ] Resolvers are functions typed as `ResolveFn<T>`
- [ ] Wildcard route (`**`) exists for 404 handling
- [ ] Route params are consumed as signals via `toSignal()`
