# Storybook

Visual development and testing environment for notification components.

## Stack

- **[Storybook ↗](https://storybook.js.org)** v10 — component explorer
- **@analogjs/storybook-angular** — Vite-based builder for [Angular ↗](https://angular.dev) (replaces Webpack)
- **@storybook/angular** — [Angular ↗](https://angular.dev) framework integration

## Quick Start

```bash
npm run storybook        # start dev server on http://localhost:6006
npm run build-storybook  # build static output to storybook-static/
```

## Configuration

All Storybook config lives in `.storybook/`:

| File                | Purpose                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `main.ts`           | Framework, builder, story globs, addons                          |
| `preview.ts`        | Global decorators, providers (animations, icon service)          |
| `preview-head.html` | Google Fonts links (Roboto, Material Symbols Rounded)            |
| `vite.config.ts`    | Minimal Vite config for Storybook (separate from project config) |
| `tsconfig.json`     | TypeScript config extending the project root                     |

### Why a separate `vite.config.ts`?

The project does not have a root `vite.config.ts` (it uses [ng-packagr ↗](https://github.com/ng-packagr/ng-packagr) for builds and [Vitest ↗](https://vitest.dev) has its own config). The Storybook Vite config is intentionally minimal — the `@analogjs/storybook-angular` preset adds the Angular compiler plugin automatically.

### Preview setup

`preview.ts` provides the Angular environment that notification components need at runtime:

- **Azure Blue M3 theme** (`@angular/material/prebuilt-themes/azure-blue.css`) — provides typography, shape (border-radius), and interactive state tokens (ripples, hover). Without a theme, snackbar text, corners, and button effects fall back to unstyled browser defaults. Azure Blue is used as a neutral baseline; it does not affect notification severity colors, which are driven by `--tbx-mat-notification-*` custom properties in the SCSS partial.
- `provideAnimationsAsync()` — required by Material snackbar animations
- `MAT_ICON_DEFAULT_OPTIONS` — sets the default icon font set
- `TBX_MAT_NOTIFICATION_PROVIDER_CONFIG` — icon configuration (uses `TbxMatNotificationSeverityFontIconService` with [Material Symbols Rounded ↗](https://fonts.google.com/icons))
- Imports `_tbx-mat-notifications.scss` — the global styles for severity colors and countdown bar

### Font loading

`preview-head.html` loads Google Fonts directly via CDN links. This mirrors how consuming applications load these fonts. The two fonts loaded are:

- **Roboto** — [Material Design ↗](https://m3.material.io) default body font
- **[Material Symbols Rounded ↗](https://fonts.google.com/icons)** — icon font used by the notification icon service

## Writing Stories

Stories live alongside their components as `*.stories.ts` files (e.g., `notification.component.stories.ts`).

Since notifications are triggered programmatically via `TbxMatNotificationService` (they render in the CDK overlay, not inline), stories use a harness component pattern — a wrapper with buttons that call the service methods.

### Story file location

```
src/
  components/
    notification.component.ts
    notification-font-icons.stories.ts  ← story file (one per icon strategy)
    notification.component.spec.ts      ← unit tests
```

### Example: adding a new story

```typescript
import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatNotificationService } from '../services/notification.service';

@Component({
    selector: 'tbx-my-harness',
    template: `<button (click)="notify.success('It works!')">Test</button>`,
})
class MyHarnessComponent {
    readonly notify = inject(TbxMatNotificationService);
}

const meta: Meta<MyHarnessComponent> = {
    title: 'My Story',
    component: MyHarnessComponent,
    decorators: [moduleMetadata({ imports: [MyHarnessComponent] })],
};

export default meta;
type Story = StoryObj<MyHarnessComponent>;

export const Default: Story = {};
```

## Build Output

`npm run build-storybook` produces a static site in `storybook-static/` (git-ignored). This can be deployed to any static host for review.

## Dependencies

[Storybook ↗](https://storybook.js.org) requires several [Angular ↗](https://angular.dev) packages as devDependencies that the library normally receives from consumers at runtime:

- `@angular/common`
- `@angular/cdk`
- `@angular/animations`
- `@angular/forms`
- `@angular/platform-browser-dynamic`

These are listed in `devDependencies` and are not published as part of the package.
