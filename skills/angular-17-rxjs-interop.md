# Angular 17 RxJS-Signal Interop

> **ROLE**: You are generating Angular 17 code that bridges RxJS observables and signals. Follow every rule below exactly.

> **WHEN TO USE**: Use this skill when the user needs to convert between observables and signals, handle subscriptions, or use RxJS operators with signals.

> **OUTPUT FORMAT**: Output complete TypeScript code. Always import from `@angular/core/rxjs-interop`.

---

## Decision Tree — Which Tool to Use

1. **You have an Observable and need a signal for the template?** → Use `toSignal()`
2. **You have a signal and need RxJS operators (debounce, switchMap)?** → Use `toObservable()`
3. **You have a manual `.subscribe()` and need auto-cleanup?** → Use `takeUntilDestroyed()`

---

## toSignal() — Convert Observable to Signal

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
```

### Basic usage:
```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({ ... })
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  // Convert route param observable → signal
  userId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')!))
  );

  // Chain: route param → API call → signal
  user = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')!),
      switchMap(id => this.userService.getById(id)),
    )
  );
}
```

### With initial value (removes `undefined` from type):
```typescript
const users = toSignal(this.userService.getAll(), { initialValue: [] });
// Type: Signal<User[]>    ← not Signal<User[] | undefined>
```

### With requireSync (for BehaviorSubject that emits immediately):
```typescript
const currentUser = toSignal(this.auth.currentUser$, { requireSync: true });
// Type: Signal<User | null>    ← not Signal<User | null | undefined>
```

### Rules:
- `toSignal()` automatically unsubscribes when the component is destroyed. No cleanup needed.
- YOU MUST provide `initialValue` when `undefined` is not acceptable in the template.
- YOU MUST use `requireSync: true` when the source is a `BehaviorSubject` or `ReplaySubject(1)`.

---

## toObservable() — Convert Signal to Observable

Use this when you need RxJS operators that have no signal equivalent.

```typescript
import { toObservable } from '@angular/core/rxjs-interop';
```

### Example: Debounced search
```typescript
import { Component, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({ ... })
export class SearchComponent {
  searchTerm = signal('');

  results = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchService.search(term)),
    ),
    { initialValue: [] }
  );
}
```

### When to use toObservable():
- YOU MUST use `toObservable()` when you need: `debounceTime`, `throttleTime`, `switchMap`, `mergeMap`, `concatMap`, `distinctUntilChanged`, `combineLatest`, `retry`, or `catchError`.
- YOU MUST NOT use `toObservable()` for simple derived values — use `computed()` instead.

---

## takeUntilDestroyed() — Auto-Unsubscribe

Use this for any manual `.subscribe()` call to prevent memory leaks.

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
```

### In constructor (no argument needed):
```typescript
@Component({ ... })
export class PollingComponent {
  constructor() {
    interval(5000)
      .pipe(
        takeUntilDestroyed(),  // auto-unsubscribes when component is destroyed
        switchMap(() => this.dataService.refresh()),
      )
      .subscribe(data => this.processData(data));
  }
}
```

### Outside constructor (pass DestroyRef):
```typescript
import { inject, DestroyRef } from '@angular/core';

@Component({ ... })
export class AlternativeComponent {
  private destroyRef = inject(DestroyRef);

  startPolling(): void {
    interval(5000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),  // must pass DestroyRef outside constructor
        switchMap(() => this.dataService.refresh()),
      )
      .subscribe(data => this.processData(data));
  }
}
```

### Rules:
- YOU MUST use `takeUntilDestroyed()` on every manual `.subscribe()` call.
- Inside the constructor, call `takeUntilDestroyed()` with no arguments.
- Outside the constructor, call `takeUntilDestroyed(this.destroyRef)` with an injected `DestroyRef`.
- YOU MUST NOT store `Subscription` objects or call `.unsubscribe()` manually.

---

## Common Patterns

### Reactive Search with Loading State:
```typescript
@Component({ ... })
export class SearchPageComponent {
  query = signal('');
  isLoading = signal(false);

  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading.set(true)),
      switchMap(q => this.searchService.search(q)),
      tap(() => this.isLoading.set(false)),
    ),
    { initialValue: [] }
  );
}
```

### Combining Multiple Signals:
```typescript
@Component({ ... })
export class FilteredListComponent {
  category = signal('all');
  sortBy = signal('name');
  page = signal(1);

  items = toSignal(
    combineLatest([
      toObservable(this.category),
      toObservable(this.sortBy),
      toObservable(this.page),
    ]).pipe(
      debounceTime(100),
      switchMap(([cat, sort, pg]) =>
        this.itemService.query({ category: cat, sortBy: sort, page: pg })
      ),
    ),
    { initialValue: [] }
  );
}
```

---

## When to Use Signal vs RxJS

| Situation                          | Use this                              |
|------------------------------------|---------------------------------------|
| Simple derived value               | `computed()`                          |
| Simple UI state (toggle, count)    | `signal()`                            |
| Route params in template           | `toSignal(route.paramMap)`            |
| Debounced search input             | `toObservable()` + `debounceTime`     |
| HTTP request                       | `HttpClient` (returns Observable)     |
| Auto-cleanup for subscriptions     | `takeUntilDestroyed()`               |
| WebSocket / streaming data         | RxJS Observable → `toSignal()`        |
| Complex async orchestration        | RxJS operators                        |

---

## Self-Check

Before returning code, verify:
- [ ] `toSignal()` used to consume observables in templates (not `async` pipe)
- [ ] `toSignal()` has `initialValue` when `undefined` is unacceptable
- [ ] `toObservable()` used only when RxJS operators are needed
- [ ] `takeUntilDestroyed()` used on every manual `.subscribe()` call
- [ ] No manual `.unsubscribe()` calls anywhere
- [ ] No nested `.subscribe()` calls — use `switchMap` instead
- [ ] `computed()` used for simple derived values (not `toObservable` + `map`)
- [ ] All imports from `@angular/core/rxjs-interop` are present
