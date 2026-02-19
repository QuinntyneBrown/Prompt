# Angular 17 HttpClient & Functional Interceptors

> **ROLE**: You are generating Angular 17 HTTP code. All interceptors MUST be functions. All responses MUST be typed. Follow every rule below.

> **WHEN TO USE**: Use this skill when the user asks about HTTP calls, API services, interceptors, or `HttpClient`.

> **OUTPUT FORMAT**: Output complete TypeScript files with all imports.

---

## Step-by-Step: How to Set Up HttpClient

**Step 1.** In `app.config.ts`, add `provideHttpClient` with `withFetch()` and `withInterceptors()`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
  ],
};
```

**Step 2.** Write interceptors as functions (see patterns below).

**Step 3.** Write API services that inject `HttpClient` and type all responses.

---

## Critical Rules

- YOU MUST use `provideHttpClient()` in `app.config.ts` — not `HttpClientModule`.
- YOU MUST add `withFetch()` for the modern fetch API.
- YOU MUST write interceptors as functions (`HttpInterceptorFn`), not classes.
- YOU MUST type all HTTP responses: `get<User[]>()`, `post<User>()`, etc.
- YOU MUST NOT create classes that implement `HttpInterceptor`.

**WRONG — DO NOT generate this:**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) { ... }
}
```

**RIGHT — Always generate this:**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => { ... };
```

---

## Pattern: Auth Token Interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
```

**Rules:**
- YOU MUST clone the request. Never mutate the original request.
- YOU MUST use `inject()` to get services inside the interceptor function.

---

## Pattern: Error Handling Interceptor

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status === 403) {
        router.navigate(['/forbidden']);
      }
      return throwError(() => error);
    }),
  );
};
```

---

## Pattern: Logging Interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = performance.now();
  return next(req).pipe(
    tap({
      next: () => console.log(`${req.method} ${req.urlWithParams} — ${(performance.now() - started).toFixed(0)}ms`),
      error: (err) => console.error(`${req.method} ${req.urlWithParams} FAILED`, err),
    }),
  );
};
```

---

## Pattern: Retry Interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        if (error.status >= 400 && error.status < 500) {
          throw error; // do NOT retry client errors (4xx)
        }
        return timer(retryCount * 1000); // backoff for server errors (5xx)
      },
    }),
  );
};
```

---

## Pattern: Typed API Service

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/users';

  getAll(page = 1, pageSize = 10): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<User>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  update(id: string, user: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

**Rules for API services:**
- YOU MUST type every HTTP method call: `get<Type>()`, `post<Type>()`, etc.
- YOU MUST use `inject(HttpClient)` — not constructor injection.
- API services should be thin wrappers — no business logic.

---

## Self-Check

Before returning HTTP code, verify:
- [ ] `provideHttpClient(withFetch(), withInterceptors([...]))` is in `app.config.ts`
- [ ] All interceptors are functions (`HttpInterceptorFn`), not classes
- [ ] Auth interceptor clones the request, never mutates it
- [ ] All HTTP calls are typed: `get<User>()`, `post<User>()`, etc.
- [ ] Error interceptor handles 401 and 403
- [ ] API services use `inject(HttpClient)`
- [ ] No `HttpClientModule` import anywhere
