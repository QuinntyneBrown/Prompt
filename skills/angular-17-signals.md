# Angular 17 Signals

> **ROLE**: You are generating Angular 17 code that uses Signals for state management. Follow every rule below exactly.

> **WHEN TO USE**: Use this skill when the user asks about state management, reactivity, computed values, or effects in Angular.

> **OUTPUT FORMAT**: Output complete TypeScript code with all imports. Always import `signal`, `computed`, or `effect` from `@angular/core`.

---

## Decision Tree — Which API to Use

Follow this decision tree in order. Stop at the first match.

1. **Is the value derived from other signals?** → Use `computed()`
2. **Is the value derived from signals BUT also needs manual override?** → Use `linkedSignal()`
3. **Do you need to run a side-effect (localStorage, logging, canvas)?** → Use `effect()`
4. **Otherwise** → Use `signal()` for writable state

---

## signal() — Writable State

Use `signal()` to hold mutable state. Read with `()`. Write with `.set()` or `.update()`.

```typescript
import { signal } from '@angular/core';

// Primitive value
const count = signal(0);
count();              // read → 0
count.set(5);         // write → 5
count.update(v => v + 1); // update based on current value → 6

// Object — always use update() with spread for immutability
const user = signal<User>({ name: 'Quinn', age: 30 });
user.update(u => ({ ...u, age: u.age + 1 }));

// Array — always use update() with spread for immutability
const items = signal<Item[]>([]);
items.update(list => [...list, newItem]);
```

---

## computed() — Derived State

Use `computed()` for values that are calculated from other signals. It re-evaluates automatically when dependencies change.

```typescript
import { signal, computed } from '@angular/core';

const firstName = signal('Jane');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);

const users = signal<User[]>([]);
const searchTerm = signal('');
const filteredUsers = computed(() => {
  const term = searchTerm().toLowerCase();
  return users().filter(u => u.name.toLowerCase().includes(term));
});
const userCount = computed(() => filteredUsers().length);
```

### Rules for computed() — YOU MUST follow these:
- YOU MUST NOT modify any signal inside `computed()`. It must be a pure function.
- YOU MUST NOT mutate the DOM inside `computed()`.
- YOU MUST NOT make HTTP calls or any async calls inside `computed()`.
- YOU MUST NOT call `.set()` or `.update()` on any signal inside `computed()`.

**WRONG:**
```typescript
const doubled = computed(() => {
  count.set(count() * 2); // NEVER write to a signal inside computed!
  return count();
});
```

**RIGHT:**
```typescript
const doubled = computed(() => count() * 2);
```

---

## effect() — Side Effects ONLY

Use `effect()` ONLY for operations outside Angular's template system. This is the LAST resort.

```typescript
import { effect, signal, untracked } from '@angular/core';

@Component({ ... })
export class SettingsComponent {
  theme = signal<'light' | 'dark'>('light');

  constructor() {
    // ALLOWED: sync to localStorage
    effect(() => {
      localStorage.setItem('theme', this.theme());
    });

    // ALLOWED: logging
    effect(() => {
      console.log('Theme changed to:', this.theme());
    });

    // ALLOWED: use untracked() to read signals without creating a dependency
    effect(() => {
      const t = this.theme(); // this IS tracked
      untracked(() => {
        this.analytics.log('theme_change', t); // this is NOT tracked
      });
    });
  }
}
```

### When to use effect() — ONLY these cases:
- Sync data to `localStorage`, `sessionStorage`, or cookies
- Logging or analytics
- Custom DOM rendering (canvas, chart libraries)
- Calling external non-Angular APIs

### When NOT to use effect() — NEVER these cases:
- YOU MUST NOT write to other signals inside `effect()`. This causes infinite loops.
- YOU MUST NOT use `effect()` to calculate derived values. Use `computed()` instead.
- YOU MUST NOT use `effect()` to propagate state changes.

**WRONG:**
```typescript
effect(() => {
  this.fullName.set(`${this.firstName()} ${this.lastName()}`); // NEVER do this
});
```

**RIGHT:**
```typescript
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

---

## linkedSignal() — Derived + Manually Settable

Use when you need a value that derives from a signal AND can be manually overridden.

```typescript
import { signal, linkedSignal } from '@angular/core';

const items = signal<string[]>(['apple', 'banana']);
const selectedItem = linkedSignal(() => items()[0]); // auto-derives

items.set(['cherry', 'date']); // selectedItem() → 'cherry' (auto-updated)
selectedItem.set('date');       // selectedItem() → 'date' (manually overridden)
```

---

## Service Pattern with Signals

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Private writable signal
  private readonly _items = signal<CartItem[]>([]);

  // Public read-only signal — outsiders cannot write to it
  readonly items = this._items.asReadonly();

  // Computed derived values
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.qty, 0)
  );

  // Mutations go through methods
  addItem(item: CartItem): void {
    this._items.update(items => [...items, item]);
  }

  removeItem(id: string): void {
    this._items.update(items => items.filter(i => i.id !== id));
  }

  clear(): void {
    this._items.set([]);
  }
}
```

### Rules for services:
- YOU MUST make the writable signal `private`.
- YOU MUST expose it with `.asReadonly()`.
- YOU MUST use `computed()` for any derived values.
- YOU MUST put all mutations in public methods.

---

## Custom Equality (prevent unnecessary updates)

```typescript
const position = signal(
  { x: 0, y: 0 },
  { equal: (a, b) => a.x === b.x && a.y === b.y }
);
```

---

## Self-Check

Before returning code, verify:
- [ ] Derived values use `computed()`, not `effect()`
- [ ] `effect()` is only used for localStorage, logging, or canvas
- [ ] No `.set()` or `.update()` calls inside `computed()`
- [ ] No `.set()` or `.update()` calls inside `effect()`
- [ ] Services expose `.asReadonly()` signals
- [ ] `untracked()` used when reading signals that should not be dependencies
