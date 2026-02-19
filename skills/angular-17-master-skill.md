# Angular 17 Master Skill

> **ROLE**: You are an Angular 17 code generator. When asked to write Angular code, you MUST follow every rule in this document. Your output MUST be valid Angular 17 TypeScript that compiles without errors.

> **WHEN TO USE**: Apply this skill whenever you are asked to write, generate, review, or fix Angular code. This is your primary reference. Use the sub-skill files below for detailed code patterns.

> **OUTPUT FORMAT**: Always output complete, compilable TypeScript files. Include all import statements. Never use `// ...` to skip code. Never output partial files unless explicitly asked.

---

## Sub-Skills — Choose the Right Reference

Read the user's request. Then pick the matching sub-skill file for detailed patterns:

| If the user asks about...                  | Use this file                              |
|--------------------------------------------|--------------------------------------------|
| Creating a component, directive, or pipe   | `angular-17-standalone-components.md`      |
| State management, reactivity, signals      | `angular-17-signals.md`                    |
| Services, inject(), providers              | `angular-17-dependency-injection.md`       |
| Writing tests or specs                     | `angular-17-testing.md`                    |
| Template logic (@if, @for, loops)          | `angular-17-control-flow.md`               |
| Forms, validation, FormGroup               | `angular-17-reactive-forms.md`             |
| HTTP calls, interceptors, API services     | `angular-17-http-interceptors.md`          |
| Routing, guards, lazy loading              | `angular-17-routing.md`                    |
| App structure, smart/dumb components       | `angular-17-component-architecture.md`     |
| RxJS with signals, subscriptions           | `angular-17-rxjs-interop.md`              |
| Refactoring messy/legacy code, cleanup     | `angular-17-refactoring.md`               |

---

## 10 Mandatory Rules — Apply to ALL Generated Code

You MUST follow these rules every time you write Angular code. If you violate any rule, your output is incorrect.

### Rule 1: Standalone Everything
- YOU MUST set `standalone: true` on every component, directive, and pipe.
- YOU MUST NOT use `NgModule` or `@NgModule` anywhere.
- YOU MUST list template dependencies in the component's `imports` array.

### Rule 2: Signals First
- YOU MUST use `signal()` for mutable state.
- YOU MUST use `computed()` for any value derived from other signals.
- YOU MUST NOT use `effect()` to derive state. Only use `effect()` for side-effects like localStorage or logging.
- YOU MUST NOT use `BehaviorSubject` when `signal()` would work.

### Rule 3: OnPush Always
- YOU MUST add `changeDetection: ChangeDetectionStrategy.OnPush` to every `@Component` decorator.
- YOU MUST import `ChangeDetectionStrategy` from `@angular/core`.

### Rule 4: inject() Over Constructors
- YOU MUST use `inject(ServiceName)` as a class field to get dependencies.
- YOU MUST NOT put services in constructor parameters.

**WRONG:**
```typescript
constructor(private userService: UserService) {}
```

**RIGHT:**
```typescript
private userService = inject(UserService);
```

### Rule 5: Functional Over Class-Based
- YOU MUST write route guards as functions using `CanActivateFn`.
- YOU MUST write HTTP interceptors as functions using `HttpInterceptorFn`.
- YOU MUST write resolvers as functions using `ResolveFn`.
- YOU MUST NOT create classes that implement `CanActivate`, `HttpInterceptor`, or `Resolve`.

### Rule 6: Container/Presentational Split
- Page-level components (routes) are "containers." They inject services and pass data to children.
- Reusable UI components are "presentational." They receive data via `input()` and emit events via `output()`. They MUST NOT inject any services.

### Rule 7: New Control Flow Syntax
- YOU MUST use `@if`, `@for`, `@switch` in templates.
- YOU MUST NOT use `*ngIf`, `*ngFor`, or `*ngSwitch`.
- Every `@for` MUST have a `track` expression.

**WRONG:**
```html
<div *ngIf="user">{{ user.name }}</div>
<div *ngFor="let item of items">{{ item.name }}</div>
```

**RIGHT:**
```html
@if (user(); as u) {
  <div>{{ u.name }}</div>
}
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### Rule 8: Typed Everything
- YOU MUST type all HTTP responses: `this.http.get<User[]>(url)`.
- YOU MUST use `fb.nonNullable.group()` for forms.
- YOU MUST NOT use `any` type anywhere. Use specific types or `unknown`.

### Rule 9: Lazy Load Everything
- YOU MUST use `loadComponent` or `loadChildren` for route definitions.
- YOU MUST NOT eagerly import page components in route files.

**WRONG:**
```typescript
{ path: 'users', component: UsersComponent }
```

**RIGHT:**
```typescript
{ path: 'users', loadComponent: () => import('./users.component').then(m => m.UsersComponent) }
```

### Rule 10: Auto-Unsubscribe
- YOU MUST use `takeUntilDestroyed()` for any manual `.subscribe()` call.
- YOU MUST prefer `toSignal()` over `.subscribe()` + manual assignment.
- YOU MUST NOT store `Subscription` objects or call `.unsubscribe()` manually.

---

## Input/Output API — Use Signal Functions

- YOU MUST use `input()` and `output()` from `@angular/core`.
- YOU MUST NOT use `@Input()` and `@Output()` decorators.

**WRONG:**
```typescript
@Input() name: string = '';
@Output() clicked = new EventEmitter<void>();
```

**RIGHT:**
```typescript
name = input<string>('');
clicked = output<void>();
```

---

## Architecture Blueprint — Follow This File Structure

When generating a new Angular app or feature, use this folder structure:

```
src/app/
├── app.component.ts              # Root shell (standalone)
├── app.config.ts                 # Global providers (router, http, etc.)
├── app.routes.ts                 # Top-level route definitions
├── pages/                        # Container components (one per route)
│   ├── dashboard/
│   │   ├── dashboard-page.component.ts
│   │   └── dashboard-page.component.spec.ts
│   └── users/
│       ├── users-page.component.ts
│       └── users-page.component.spec.ts
├── components/                   # Presentational components (reusable)
│   ├── user-card/
│   ├── user-list/
│   └── user-filter/
├── shared/                       # Cross-cutting UI (spinner, modal)
├── services/                     # Business logic and state
├── guards/                       # Functional route guards
├── interceptors/                 # Functional HTTP interceptors
├── resolvers/                    # Functional route resolvers
├── models/                       # TypeScript interfaces and types
└── validators/                   # Reusable form validators
```

---

## Quick Translation Table — Old Angular to Angular 17

When you see legacy patterns in existing code, replace them as follows:

| If you see this (OLD)            | Replace with this (Angular 17)             |
|----------------------------------|--------------------------------------------|
| `@NgModule({ ... })`            | Delete it. Use standalone components.       |
| `@Input() name: string`         | `name = input<string>()`                   |
| `@Output() clicked = new EventEmitter()` | `clicked = output<void>()`          |
| `constructor(private svc: Svc)` | `private svc = inject(Svc);`               |
| `*ngIf="condition"`             | `@if (condition) { }`                      |
| `*ngFor="let x of list"`        | `@for (x of list; track x.id) { }`        |
| `*ngSwitch` / `*ngSwitchCase`   | `@switch (val) { @case (x) { } }`         |
| `implements CanActivate`        | `export const myGuard: CanActivateFn = ()` |
| `implements HttpInterceptor`    | `export const myInterceptor: HttpInterceptorFn = (req, next)` |
| `pipe(async)`                   | `toSignal(observable$)`                    |
| `new BehaviorSubject(val)`      | `signal(val)`                              |
| `.subscribe()` + `ngOnDestroy`  | `.pipe(takeUntilDestroyed()).subscribe()`  |
| `{ path: 'x', component: X }`  | `{ path: 'x', loadComponent: () => import(...) }` |

---

## Self-Check — Verify Before Returning Code

Before you return any Angular code to the user, check every item below. If any item fails, fix the code before returning it.

**Components:**
- [ ] Every component has `standalone: true`
- [ ] Every component has `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Inputs use `input()`, outputs use `output()`
- [ ] Template uses `@if` / `@for` / `@switch`, never `*ngIf` / `*ngFor`

**State:**
- [ ] Mutable state uses `signal()`
- [ ] Derived values use `computed()`
- [ ] `effect()` is only used for localStorage, logging, or DOM side-effects
- [ ] Services expose `.asReadonly()` signals

**DI:**
- [ ] All dependencies use `inject()`, not constructor parameters
- [ ] Services have `@Injectable({ providedIn: 'root' })`

**HTTP:**
- [ ] All HTTP responses are typed: `get<Type>()`, `post<Type>()`
- [ ] Interceptors are functions, not classes

**Routing:**
- [ ] All routes use `loadComponent` or `loadChildren`
- [ ] Guards are functions (`CanActivateFn`), not classes

**Testing:**
- [ ] Standalone components are in `imports`, not `declarations`
- [ ] Signal inputs set via `fixture.componentRef.setInput()`
- [ ] `takeUntilDestroyed()` used for subscriptions
