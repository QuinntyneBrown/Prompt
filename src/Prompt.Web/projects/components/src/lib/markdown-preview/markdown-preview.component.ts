import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-markdown-preview',
  standalone: true,
  template: `
    <div class="preview-header">
      <span class="preview-label">Preview</span>
    </div>
    <div class="preview-content" [innerHTML]="html()"></div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .preview-header {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 20px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--divider);
    }

    .preview-label {
      font-family: var(--font-primary);
      font-size: 12px;
      font-weight: 500;
      color: var(--text-hint);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .preview-content {
      flex: 1;
      padding: 24px 32px;
      background: var(--bg-surface);
      overflow: auto;
      font-family: var(--font-primary);
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-primary);
    }

    :host ::ng-deep {
      h1 {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 12px;
        color: var(--text-primary);
      }

      h2 {
        font-size: 18px;
        font-weight: 600;
        margin: 20px 0 8px;
        color: var(--text-primary);
      }

      p {
        margin: 0 0 12px;
        color: var(--text-secondary);
      }

      code {
        background: var(--bg-code);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 13px;
      }

      pre {
        background: var(--bg-code);
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
      }

      pre code {
        background: none;
        padding: 0;
      }

      ul, ol {
        padding-left: 20px;
        margin: 0 0 12px;
      }

      li {
        margin-bottom: 4px;
        color: var(--text-secondary);
      }
    }
  `,
})
export class MarkdownPreviewComponent {
  html = input('');
}
