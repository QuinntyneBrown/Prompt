# Angular 17 Reactive Forms

> **ROLE**: You are generating Angular 17 form code using strictly typed reactive forms. Follow every rule below exactly.

> **WHEN TO USE**: Use this skill when the user asks to create a form, add validation, or work with `FormGroup`, `FormControl`, or `FormArray`.

> **OUTPUT FORMAT**: Output a complete component file with all imports. Include both the TypeScript class and the inline template.

---

## Step-by-Step: How to Create a Form

**Step 1.** Import `ReactiveFormsModule`, `FormBuilder`, and `Validators`:
```typescript
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
```

**Step 2.** Add `ReactiveFormsModule` to the component's `imports` array.

**Step 3.** Inject `FormBuilder` using `inject()`:
```typescript
private fb = inject(FormBuilder);
```

**Step 4.** Create the form with `fb.nonNullable.group()` for type safety:
```typescript
form = this.fb.nonNullable.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
});
```

**Step 5.** Use `@if` in the template for validation errors.

**Step 6.** Get typed values with `this.form.getRawValue()`.

---

## Complete Example

```typescript
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        Name
        <input formControlName="name" />
      </label>
      @if (form.controls.name.hasError('required') && form.controls.name.touched) {
        <span class="error">Name is required</span>
      }

      <label>
        Email
        <input formControlName="email" type="email" />
      </label>
      @if (form.controls.email.hasError('email') && form.controls.email.touched) {
        <span class="error">Invalid email format</span>
      }

      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: [0, [Validators.required, Validators.min(0), Validators.max(150)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    // value is typed as { name: string, email: string, age: number }
    console.log(value);
  }
}
```

---

## Rules

### YOU MUST:
- Use `fb.nonNullable.group()` so controls are typed and never null.
- Import `ReactiveFormsModule` in the component's `imports` array.
- Use `inject(FormBuilder)` — not constructor injection.
- Use `@if` for validation errors in the template — not `*ngIf`.
- Use `getRawValue()` to get the typed form value.
- Show errors only when the control is `touched` or `dirty`.

### YOU MUST NOT:
- Use `new FormGroup()` directly — use `FormBuilder` instead.
- Mix `ngModel` with reactive forms — use one or the other, never both.
- Use `any` type for form values.
- Put `*ngIf` in templates — use `@if`.

---

## NonNullable Forms

```typescript
// With nonNullable, controls reset to initial value (not null)
form = this.fb.nonNullable.group({
  name: [''],    // type: FormControl<string> (not string | null)
  active: [true], // type: FormControl<boolean> (not boolean | null)
});
```

---

## Nested FormGroups

```typescript
form = this.fb.nonNullable.group({
  personal: this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  }),
  address: this.fb.nonNullable.group({
    street: [''],
    city: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
  }),
});

// Access nested controls:
const city = this.form.controls.address.controls.city;
```

---

## FormArray

```typescript
form = this.fb.nonNullable.group({
  name: ['', Validators.required],
  tags: this.fb.nonNullable.array<string>([]),
});

addTag(tag: string): void {
  this.form.controls.tags.push(
    this.fb.nonNullable.control(tag, Validators.required)
  );
}

removeTag(index: number): void {
  this.form.controls.tags.removeAt(index);
}
```

Template:
```html
@for (tag of form.controls.tags.controls; track $index; let i = $index) {
  <div>
    <input [formControl]="tag" />
    <button type="button" (click)="removeTag(i)">Remove</button>
  </div>
}
<button type="button" (click)="addTag('')">Add Tag</button>
```

---

## Custom Validator

A custom validator is a pure function that returns `null` (valid) or an error object (invalid):

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenNameValidator(forbidden: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Usage:
name: ['', [Validators.required, forbiddenNameValidator('admin')]],
```

---

## Async Validator

```typescript
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map, catchError, of } from 'rxjs';

export function uniqueEmailValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkEmailExists(control.value).pipe(
      map(exists => (exists ? { emailTaken: true } : null)),
      catchError(() => of(null)),
    );
  };
}

// Usage — set updateOn to 'blur' to avoid too many HTTP requests:
email: new FormControl('', {
  validators: [Validators.required, Validators.email],
  asyncValidators: [uniqueEmailValidator(this.userService)],
  updateOn: 'blur',
}),
```

---

## Cross-Field Validator

Apply at the group level to compare two controls:

```typescript
export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

form = this.fb.nonNullable.group(
  {
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  },
  { validators: passwordMatchValidator() }
);
```

---

## Self-Check

Before returning form code, verify:
- [ ] `fb.nonNullable.group()` is used (not `new FormGroup()`)
- [ ] `ReactiveFormsModule` is in the component `imports` array
- [ ] `inject(FormBuilder)` is used (not constructor injection)
- [ ] Validation errors use `@if`, not `*ngIf`
- [ ] Errors show only when control is `touched`
- [ ] Async validators use `updateOn: 'blur'`
- [ ] No `ngModel` mixed with reactive forms
