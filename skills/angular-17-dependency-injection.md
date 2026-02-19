# Angular 17 Dependency Injection

> **ROLE**: You are generating Angular 17 services and dependency injection code. Follow every rule below exactly.

> **WHEN TO USE**: Use this skill when the user asks about services, dependency injection, `inject()`, providers, or `InjectionToken`.

> **OUTPUT FORMAT**: Output complete TypeScript files. Always include all import statements.

---

## Rule 1: Always Use inject()

YOU MUST use the `inject()` function as a class field. YOU MUST NOT put services in constructor parameters.

**WRONG:**
```typescript
@Component({ ... })
export class UserDetailComponent {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
}
```

**RIGHT:**
```typescript
import { Component, inject } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ ... })
export class UserDetailComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Optional dependency — returns null if not available
  private analytics = inject(AnalyticsService, { optional: true });
}
```

---

## Rule 2: Service Design Pattern

Every service MUST follow this pattern:

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  readonly activeUsers = computed(() =>
    this._users().filter(u => u.isActive)
  );

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe(users => {
      this._users.set(users);
    });
  }

  getUserById(id: string): User | undefined {
    return this._users().find(u => u.id === id);
  }
}
```

### Rules:
- YOU MUST add `@Injectable({ providedIn: 'root' })` for singleton services.
- YOU MUST use `inject()` for dependencies, not constructor parameters.
- YOU MUST make internal signals `private` and expose with `.asReadonly()`.
- YOU MUST use `computed()` for derived values.

---

## Rule 3: InjectionToken for Configuration

When you need to inject a configuration object or interface, use `InjectionToken`.

```typescript
import { InjectionToken, inject } from '@angular/core';

// Step 1: Define the interface and token
export interface AppConfig {
  apiUrl: string;
  maxRetries: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// Step 2: Provide it in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_CONFIG,
      useValue: { apiUrl: 'https://api.example.com', maxRetries: 3 },
    },
  ],
};

// Step 3: Inject it anywhere
@Injectable({ providedIn: 'root' })
export class ApiService {
  private config = inject(APP_CONFIG);
  private baseUrl = this.config.apiUrl;
}
```

---

## Rule 4: Abstract Classes for Swappable Implementations

Use abstract classes to decouple the interface from the implementation. This allows easy swapping in tests.

```typescript
// Step 1: Define abstract contract
export abstract class StorageService {
  abstract get<T>(key: string): T | null;
  abstract set<T>(key: string, value: T): void;
  abstract remove(key: string): void;
}

// Step 2: Create concrete implementation
@Injectable()
export class LocalStorageService extends StorageService {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

// Step 3: Provide in app.config.ts
providers: [
  { provide: StorageService, useClass: LocalStorageService },
]

// Step 4: In tests, swap to mock
providers: [
  { provide: StorageService, useClass: InMemoryStorageService },
]
```

---

## Rule 5: Component-Scoped Services

When each component instance needs its own service instance, add `providers` to the component:

```typescript
@Component({
  selector: 'app-editor',
  standalone: true,
  providers: [UndoService], // each editor gets its own UndoService
  template: `...`,
})
export class EditorComponent {
  private undoService = inject(UndoService);
}
```

---

## Factory Providers

```typescript
providers: [
  {
    provide: LoggerService,
    useFactory: () => {
      const config = inject(APP_CONFIG);
      return config.featureFlags['verbose']
        ? new VerboseLogger()
        : new SimpleLogger();
    },
  },
]
```

---

## Multi-Providers (multiple implementations of same token)

```typescript
export const VALIDATOR = new InjectionToken<Validator[]>('validators');

providers: [
  { provide: VALIDATOR, useClass: RequiredValidator, multi: true },
  { provide: VALIDATOR, useClass: EmailValidator, multi: true },
]

// Inject all of them as an array
private validators = inject(VALIDATOR); // Validator[]
```

---

## Self-Check

Before returning code, verify:
- [ ] `inject()` used everywhere — no constructor parameter injection
- [ ] Singleton services have `@Injectable({ providedIn: 'root' })`
- [ ] Configuration uses `InjectionToken`, not magic strings
- [ ] Swappable implementations use abstract classes
- [ ] Internal signals are `private`, exposed via `.asReadonly()`
- [ ] No circular dependencies between services
