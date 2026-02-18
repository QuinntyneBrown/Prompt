import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'lib-avatar',
  standalone: true,
  template: `
    <span class="avatar" [style.background]="background()">
      {{ initials() }}
    </span>
  `,
  styles: `
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-family: var(--font-primary);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-on-primary);
      user-select: none;
    }
  `,
})
export class AvatarComponent {
  name = input('');
  background = input('var(--primary)');

  initials = computed(() => {
    const n = this.name();
    if (!n) return '';
    const parts = n.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : n.substring(0, 2).toUpperCase();
  });
}
