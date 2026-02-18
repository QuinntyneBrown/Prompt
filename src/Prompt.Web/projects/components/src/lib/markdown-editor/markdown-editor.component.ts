import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownToolbarComponent, MarkdownAction } from '../markdown-toolbar/markdown-toolbar.component';

@Component({
  selector: 'lib-markdown-editor',
  standalone: true,
  imports: [FormsModule, MarkdownToolbarComponent],
  template: `
    @if (showToolbar()) {
      <lib-markdown-toolbar (action)="onToolbarAction($event)" />
    }
    <div class="editor-area">
      <textarea
        [value]="content()"
        (input)="content.set(textarea.value)"
        #textarea
        [placeholder]="placeholder()"
        spellcheck="false">
      </textarea>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .editor-area {
      flex: 1;
      background: var(--bg-surface);
      padding: 16px;
      overflow: auto;
    }

    textarea {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      resize: none;
      background: transparent;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.6;
      color: var(--text-primary);
    }

    textarea::placeholder {
      color: var(--text-hint);
    }
  `,
})
export class MarkdownEditorComponent {
  content = model('');
  placeholder = input('Start writing markdown...');
  showToolbar = input(true);

  onToolbarAction(action: MarkdownAction): void {
    // Toolbar actions can be handled by parent via content model changes
    // or extended with custom insertion logic
  }
}
