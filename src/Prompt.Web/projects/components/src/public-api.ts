/*
 * Public API Surface of components
 */

// Theme
export { StatusBadgeComponent } from './lib/status-badge/status-badge.component';
export type { SkillStatus } from './lib/status-badge/status-badge.component';
export { TagChipComponent } from './lib/tag-chip/tag-chip.component';
export { SearchInputComponent } from './lib/search-input/search-input.component';
export { AvatarComponent } from './lib/avatar/avatar.component';

// Layout & Navigation
export { AppToolbarComponent } from './lib/app-toolbar/app-toolbar.component';
export { EditorToolbarComponent } from './lib/editor-toolbar/editor-toolbar.component';
export type { EditorViewMode } from './lib/editor-toolbar/editor-toolbar.component';
export { SidenavComponent } from './lib/sidenav/sidenav.component';
export type { NavCategory, NavTag } from './lib/sidenav/sidenav.component';
export { NavRailComponent } from './lib/nav-rail/nav-rail.component';
export type { NavRailItem } from './lib/nav-rail/nav-rail.component';
export { BottomNavComponent } from './lib/bottom-nav/bottom-nav.component';
export type { BottomNavItem } from './lib/bottom-nav/bottom-nav.component';
export { FilterChipsComponent } from './lib/filter-chips/filter-chips.component';
export { FileTreeComponent } from './lib/file-tree/file-tree.component';
export type { FileItem } from './lib/file-tree/file-tree.component';
export { FabComponent } from './lib/fab/fab.component';

// Cards
export { SkillCardComponent } from './lib/skill-card/skill-card.component';

// Editor
export { MarkdownToolbarComponent } from './lib/markdown-toolbar/markdown-toolbar.component';
export type { MarkdownAction } from './lib/markdown-toolbar/markdown-toolbar.component';
export { MarkdownEditorComponent } from './lib/markdown-editor/markdown-editor.component';
export { MarkdownPreviewComponent } from './lib/markdown-preview/markdown-preview.component';

// Dialogs
export { SkillFormDialogComponent } from './lib/skill-form-dialog/skill-form-dialog.component';
export type { SkillFormData, SkillFormDialogInput } from './lib/skill-form-dialog/skill-form-dialog.component';
export { DeleteConfirmDialogComponent } from './lib/delete-confirm-dialog/delete-confirm-dialog.component';
export type { DeleteConfirmData } from './lib/delete-confirm-dialog/delete-confirm-dialog.component';
