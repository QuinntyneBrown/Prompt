# Angular 17 Control Flow & Deferrable Views

> **ROLE**: You are generating Angular 17 templates. You MUST use the new built-in control flow syntax. Never use the old structural directives.

> **WHEN TO USE**: Use this skill when writing any Angular template that has conditional rendering, loops, or switch statements.

> **OUTPUT FORMAT**: Output HTML templates inside Angular component `template` strings. Use the new `@if`, `@for`, `@switch` syntax only.

---

## Critical Rule

**YOU MUST use `@if`, `@for`, `@switch`.** These are built into Angular 17 and require no imports.

**YOU MUST NOT use `*ngIf`, `*ngFor`, `*ngSwitch`.** These are legacy. Do not generate them.

---

## @if — Conditional Rendering

### Simple condition:
```html
@if (isLoggedIn()) {
  <app-dashboard />
}
```

### With else:
```html
@if (user(); as u) {
  <h1>Welcome, {{ u.name }}</h1>
} @else {
  <app-login-prompt />
}
```

### With else if:
```html
@if (status() === 'loading') {
  <app-spinner />
} @else if (status() === 'error') {
  <app-error [message]="errorMessage()" />
} @else {
  <app-content [data]="data()" />
}
```

### WRONG vs RIGHT:

**WRONG — DO NOT generate this:**
```html
<div *ngIf="user">{{ user.name }}</div>
<ng-template #noUser><p>No user</p></ng-template>
```

**RIGHT — Always generate this:**
```html
@if (user(); as u) {
  <div>{{ u.name }}</div>
} @else {
  <p>No user</p>
}
```

---

## @for — Iteration

### Basic loop (track is REQUIRED):
```html
@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
} @empty {
  <p>No users found.</p>
}
```

### With index and context variables:
```html
@for (item of items(); track item.id; let i = $index, let isLast = $last) {
  <div>{{ i + 1 }}. {{ item.name }}</div>
}
```

### Available context variables:
- `$index` — current index (number)
- `$first` — true if first item (boolean)
- `$last` — true if last item (boolean)
- `$even` — true if even index (boolean)
- `$odd` — true if odd index (boolean)
- `$count` — total number of items (number)

### Rules for `track`:
- YOU MUST provide `track` in every `@for`. It is required.
- YOU MUST use a unique identifier like `track item.id`.
- Use `track $index` ONLY for static lists that never change.
- YOU MUST NOT use `track item` (tracks by object identity — bad performance).

### WRONG vs RIGHT:

**WRONG — DO NOT generate this:**
```html
<div *ngFor="let item of items">{{ item.name }}</div>
```

**RIGHT — Always generate this:**
```html
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found.</p>
}
```

---

## @switch — Pattern Matching

```html
@switch (status()) {
  @case ('pending') {
    <span class="badge warning">Pending</span>
  }
  @case ('active') {
    <span class="badge success">Active</span>
  }
  @case ('inactive') {
    <span class="badge secondary">Inactive</span>
  }
  @default {
    <span class="badge info">Unknown</span>
  }
}
```

### WRONG vs RIGHT:

**WRONG — DO NOT generate this:**
```html
<div [ngSwitch]="status()">
  <span *ngSwitchCase="'pending'">Pending</span>
  <span *ngSwitchCase="'active'">Active</span>
  <span *ngSwitchDefault>Unknown</span>
</div>
```

**RIGHT — Always generate this:**
```html
@switch (status()) {
  @case ('pending') { <span>Pending</span> }
  @case ('active') { <span>Active</span> }
  @default { <span>Unknown</span> }
}
```

---

## @defer — Lazy Loading in Templates

Use `@defer` to lazy-load heavy components. They are not loaded until the trigger condition is met.

### Basic example:
```html
@defer {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div>Loading chart...</div>
} @loading (minimum 300ms) {
  <app-spinner />
} @error {
  <p>Failed to load chart.</p>
}
```

### Trigger types:
```html
@defer (on viewport) { ... }       <!-- when element enters viewport -->
@defer (on interaction) { ... }    <!-- when user clicks/taps -->
@defer (on hover) { ... }          <!-- when user hovers -->
@defer (on idle) { ... }           <!-- when browser is idle -->
@defer (on timer(2s)) { ... }      <!-- after 2 seconds -->
@defer (when isAdmin()) { ... }    <!-- when condition is true -->
```

### Prefetching (load code early, render later):
```html
@defer (on interaction; prefetch on idle) {
  <app-details-panel />
} @placeholder {
  <button>Show Details</button>
}
```

### @defer sub-blocks:
| Block          | Purpose                                  |
|----------------|------------------------------------------|
| `@defer`       | The content to lazily load               |
| `@placeholder` | Shown before loading starts              |
| `@loading`     | Shown while the component is loading     |
| `@error`       | Shown if the component fails to load     |

---

## Complete Translation Table

| OLD (never use)                  | NEW (always use)                         |
|----------------------------------|------------------------------------------|
| `*ngIf="cond"`                  | `@if (cond) { }`                         |
| `*ngIf="cond; else tpl"`       | `@if (cond) { } @else { }`              |
| `*ngFor="let x of list"`       | `@for (x of list; track x.id) { }`      |
| `[ngSwitch]` + `*ngSwitchCase` | `@switch (val) { @case (v) { } }`       |

---

## Self-Check

Before returning template code, verify:
- [ ] Using `@if`, not `*ngIf`
- [ ] Using `@for`, not `*ngFor`
- [ ] Using `@switch`, not `[ngSwitch]`
- [ ] Every `@for` has `track` with a unique identifier
- [ ] `@empty` block provided for `@for` where appropriate
- [ ] `@defer` has `@placeholder` to prevent layout shift
- [ ] No `CommonModule` imported just for old structural directives
