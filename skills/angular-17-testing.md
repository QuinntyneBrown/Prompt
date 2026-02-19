# Angular 17 Testing

> **ROLE**: You are generating Angular 17 test files (`.spec.ts`). Follow every rule below exactly.

> **WHEN TO USE**: Use this skill when the user asks to write tests, specs, or unit tests for Angular components, services, guards, or forms.

> **OUTPUT FORMAT**: Output a complete `.spec.ts` file with all imports, `describe`, `beforeEach`, and `it` blocks. Never skip code.

---

## Critical Rules for Angular 17 Tests

1. **Standalone components go in `imports`, not `declarations`.**
   - WRONG: `declarations: [MyComponent]`
   - RIGHT: `imports: [MyComponent]`

2. **Set signal inputs with `fixture.componentRef.setInput()`.**
   - WRONG: `component.user = someUser;`
   - RIGHT: `fixture.componentRef.setInput('user', someUser);`

3. **Always call `fixture.detectChanges()` after setting inputs.**

4. **Mock services with `jasmine.createSpyObj` or `jest.fn()`.** Never use real services in unit tests.

5. **Use `provideHttpClientTesting()` for HTTP tests.** Never make real HTTP calls.

6. **Test guards with `TestBed.runInInjectionContext()`.** Guards are functions, not classes.

---

## Pattern: Test a Standalone Component

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent], // standalone → imports, NOT declarations
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should display user name', () => {
    fixture.componentRef.setInput('user', { id: '1', name: 'Quinn' });
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('h3');
    expect(el.textContent).toContain('Quinn');
  });

  it('should emit selected event on button click', () => {
    const user = { id: '1', name: 'Quinn' };
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();

    const spy = jasmine.createSpy();
    component.selected.subscribe(spy);

    fixture.nativeElement.querySelector('button').click();

    expect(spy).toHaveBeenCalledWith(user);
  });
});
```

---

## Pattern: Shallow Test (Replace Child Components with Stubs)

```typescript
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard.component';

@Component({ selector: 'app-chart', standalone: true, template: '' })
class ChartStubComponent {}

describe('DashboardComponent (shallow)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    })
      .overrideComponent(DashboardComponent, {
        remove: { imports: [ChartComponent] },
        add: { imports: [ChartStubComponent] },
      })
      .compileComponents();
  });
});
```

---

## Pattern: Test a Signal-Based Service

```typescript
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should start with empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.total()).toBe(0);
  });

  it('should add items and update computed values', () => {
    service.addItem({ id: '1', name: 'Widget', price: 10, qty: 2 });

    expect(service.items().length).toBe(1);
    expect(service.total()).toBe(20);
    expect(service.itemCount()).toBe(2);
  });

  it('should remove items', () => {
    service.addItem({ id: '1', name: 'Widget', price: 10, qty: 1 });
    service.addItem({ id: '2', name: 'Gadget', price: 25, qty: 1 });
    service.removeItem('1');

    expect(service.items().length).toBe(1);
    expect(service.total()).toBe(25);
  });
});
```

---

## Pattern: Test a Service with HttpClient

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ALWAYS call this — catches unexpected HTTP requests
  });

  it('should load users from API', () => {
    const mockUsers = [{ id: '1', name: 'Quinn', isActive: true }];
    service.loadUsers();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(service.users()).toEqual(mockUsers);
  });
});
```

---

## Pattern: Test a Component with Mocked Service

```typescript
describe('UserListComponent', () => {
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['loadUsers'], {
      users: signal<User[]>([]),
      activeUsers: signal<User[]>([]),
    });

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();
  });

  it('should call loadUsers on init', () => {
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();
    expect(mockUserService.loadUsers).toHaveBeenCalled();
  });
});
```

---

## Pattern: Test a Functional Guard

Guards in Angular 17 are functions, not classes. Test them using `TestBed.runInInjectionContext()`.

```typescript
import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
  });

  it('should allow access when authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(true);
  });

  it('should redirect when not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBeTruthy(); // returns UrlTree for redirect
  });
});
```

---

## Pattern: Test Reactive Forms

```typescript
describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should validate email format', () => {
    component.form.controls.email.setValue('not-an-email');
    expect(component.form.controls.email.hasError('email')).toBeTrue();

    component.form.controls.email.setValue('test@example.com');
    expect(component.form.controls.email.valid).toBeTrue();
  });
});
```

---

## Self-Check

Before returning test code, verify:
- [ ] Standalone components are in `imports`, not `declarations`
- [ ] Signal inputs use `fixture.componentRef.setInput()`, not direct assignment
- [ ] `fixture.detectChanges()` is called after setting inputs
- [ ] Services are mocked — no real services in unit tests
- [ ] `httpMock.verify()` is in `afterEach()` for HTTP tests
- [ ] Guards are tested with `TestBed.runInInjectionContext()`
- [ ] All `import` statements are included at the top of the file
