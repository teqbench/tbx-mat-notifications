# @teqbench/tbx-mat-notifications

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-number.json)

> An opinionated thin layer around [Angular Material Snackbar ↗](https://material.angular.dev/components/snack-bar/api). Provides `TbxMatNotificationService` with severity-leveled methods (`success()`, `error()`, `warning()`, `information()`, `help()`), optional action button with multiple appearance variants, FIFO queuing with signal-based state, configurable duration, a pure-CSS countdown bar, and native [MatSnackBarRef ↗](https://material.angular.dev/components/snack-bar/api) exposure via `TbxMatNotificationRef`. All service methods return `TbxMatNotificationRef` synchronously with promises for the native ref and dismiss result.

## Installation

Configure npm to use [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/tbx-mat-notifications
```

### Prerequisites

This package renders inside [Angular Material ↗](https://material.angular.dev)'s snackbar overlay and relies on an **active [M3 ↗](https://m3.material.io) theme** for typography, shape (border-radius), and interactive states (button ripples, hover effects). If no [Material ↗](https://material.angular.dev) theme is applied, notifications will render with unstyled browser defaults.

Notification severity colors (success = green, error = red, etc.) are **not** tied to the theme palette — they use dedicated CSS custom properties and remain consistent regardless of which theme is active.

Import the global notification styles in your application's stylesheet:

```scss
@use '@teqbench/tbx-mat-notifications/styles/tbx-mat-notifications';
```

## Usage

### Fire-and-forget

```typescript
import { TbxMatNotificationService } from '@teqbench/tbx-mat-notifications';

private readonly notify = inject(TbxMatNotificationService);

// Convenience methods — prefix with void when not awaiting the result
void this.notify.success('Item saved successfully.');
void this.notify.error('Failed to load data. Please try again.');
void this.notify.warning('Your session will expire in 5 minutes.');
void this.notify.information('New version available.');
void this.notify.help('Click the + button to add a new item.');
```

### Action button

```typescript
import { TbxMatNotificationService, TbxMatNotificationDismissReason } from '@teqbench/tbx-mat-notifications';

const ref = this.notify.success('Item deleted.', {
    action: { label: 'Undo' },
    duration: 30_000,
});

const result = await ref.result;
if (result.dismissReason === TbxMatNotificationDismissReason.Action) {
    this.undoDelete();
}
```

### Full control via show()

```typescript
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-notifications';

this.notify.show({
    type: TbxMatSeverityLevel.Warning,
    message: 'Unsaved changes will be lost.',
    duration: 30_000,
    showCountdown: true,
    action: { label: 'Discard' },
    snackBarConfig: {
        horizontalPosition: 'center',
        verticalPosition: 'top',
    },
});
```

### Native snackbar ref access

```typescript
const ref = this.notify.error('Upload failed.', {
    action: { label: 'Retry' },
});

const snackBarRef = await ref.snackBarRef;
snackBarRef?.afterOpened().subscribe(() => {
    console.log('Notification is visible');
});
```

### Queue state (reactive signals)

```typescript
this.notify.isActive(); // whether a notification is visible
this.notify.pendingCount(); // notifications waiting in the queue
```

### Dismiss

```typescript
this.notify.dismiss(); // dismiss current (resolves with ProgrammaticDismissCurrent)
this.notify.dismissAll(); // clear current + all queued (resolves with ProgrammaticDismissAll)
```

`dismiss()` and `dismissAll()` are convenience wrappers that correctly track the dismiss reason. Using the native [MatSnackBarRef ↗](https://material.angular.dev/components/snack-bar/api) `dismiss()` directly bypasses enriched reason tracking — the result promise may resolve with `Timeout` instead of the expected programmatic reason.

### Duration

- **Not set** — defaults to 10000ms
- **Positive** — used as-is, no clamping
- **Zero or negative** — indefinite (no auto-dismiss, only dismissed by action, close, or programmatic dismiss)

For notifications with an action button, a longer duration is recommended (e.g., 30000ms) to give users time to read and respond.

The countdown bar only renders when `showCountdown` is `true` AND duration is positive. Setting `showCountdown: true` with indefinite duration has no visible effect.

### Icon Configuration

Icons are configured via the `TBX_MAT_NOTIFICATION_PROVIDER_CONFIG` injection token, which is required. The config provides a severity icon resolver service, an optional close icon resolver, and optional action button defaults.

#### Font icons with `MAT_ICON_DEFAULT_OPTIONS`

```typescript
// app.config.ts
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import {
    TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    TbxMatNotificationSeverityFontIconService,
} from '@teqbench/tbx-mat-notifications';

providers: [
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
    {
        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
        }),
    },
];
```

#### Font icons with explicit fontSet

```typescript
providers: [
    {
        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatNotificationSeverityFontIconService('material-symbols-rounded'),
        }),
    },
];
```

#### SVG icons

Subclass `TbxMatNotificationSeveritySvgIconService` to register your own SVG markup:

```typescript
import { Injectable } from '@angular/core';
import { TbxMatNotificationSeveritySvgIconService } from '@teqbench/tbx-mat-notifications';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';

// MyNotificationSvgIcons is a consumer-defined subclass
@Injectable()
export class MyNotificationSvgIcons extends TbxMatNotificationSeveritySvgIconService {
    protected override initialize(): void {
        super.initialize();
        this.register(TbxMatSeverityLevel.Success, '<svg>...</svg>');
    }
}
```

#### Custom close icon

The close button icon is resolved via `closeIconResolverService` on the provider config. When omitted, the package provides a default font-based resolver (`TbxMatNotificationCloseFontIconService`) that registers the `close` [Material Symbols ↗](https://fonts.google.com/icons) ligature.

```typescript
{
    provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    useFactory: () => ({
        severityIconResolverService: new TbxMatNotificationSeverityFontIconService('material-symbols-rounded'),
        closeIconResolverService: new MyCloseIconService('material-symbols-rounded'),
    }),
}
```

### CSS Custom Properties

Notification appearance is customizable via CSS custom properties. Set them globally on `html` or scope them to a panel class for per-severity overrides.

#### Layout

| Property                                   | Default     | Description                          |
| ------------------------------------------ | ----------- | ------------------------------------ |
| `--tbx-mat-notification-padding`           | `0.25rem`   | Host element padding                 |
| `--tbx-mat-notification-font-size`         | `inherit`   | Message text size                    |
| `--tbx-mat-notification-icon-size`         | `1.5rem`    | Severity icon size                   |
| `--tbx-mat-notification-label-gap`         | `1rem`      | Gap between icon and message         |
| `--tbx-mat-notification-actions-padding`   | `1rem`      | Padding before actions area          |
| `--tbx-mat-notification-actions-gap`       | `0.5rem`    | Gap between action and close buttons |
| `--tbx-mat-notification-countdown-height`  | `0.1875rem` | Countdown bar thickness              |
| `--tbx-mat-notification-countdown-opacity` | `0.4`       | Countdown bar opacity                |

#### Colors

| Property                                        | Default                                                            | Description                 |
| ----------------------------------------------- | ------------------------------------------------------------------ | --------------------------- |
| `--tbx-mat-notification-success-background`     | ![#2E7D32](https://placehold.co/15x15/2E7D32/2E7D32.png) `#2E7D32` | Success background          |
| `--tbx-mat-notification-success-text`           | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Success text/icon color     |
| `--tbx-mat-notification-error-background`       | ![#C62828](https://placehold.co/15x15/C62828/C62828.png) `#C62828` | Error background            |
| `--tbx-mat-notification-error-text`             | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Error text/icon color       |
| `--tbx-mat-notification-warning-background`     | ![#F9A825](https://placehold.co/15x15/F9A825/F9A825.png) `#F9A825` | Warning background          |
| `--tbx-mat-notification-warning-text`           | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Warning text/icon color     |
| `--tbx-mat-notification-information-background` | ![#1565C0](https://placehold.co/15x15/1565C0/1565C0.png) `#1565C0` | Information background      |
| `--tbx-mat-notification-information-text`       | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Information text/icon color |
| `--tbx-mat-notification-help-background`        | ![#1976D2](https://placehold.co/15x15/1976D2/1976D2.png) `#1976D2` | Help background             |
| `--tbx-mat-notification-help-text`              | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Help text/icon color        |

#### Action Button Opacity

Control the transparency of action button elements relative to the panel's text color. All variant tokens default to `--tbx-mat-notification-action-text-opacity` unless overridden. Set on `html` globally or on a panel class for per-severity overrides.

| Property                                                         | Default                                       | Description                     |
| ---------------------------------------------------------------- | --------------------------------------------- | ------------------------------- |
| `--tbx-mat-notification-action-text-opacity`                     | `0.8`                                         | Text button label opacity       |
| `--tbx-mat-notification-action-filled-container-opacity`         | `var(--...-action-text-opacity)`              | Filled button container opacity |
| `--tbx-mat-notification-action-tonal-container-opacity`          | `0.55`                                        | Tonal button container opacity  |
| `--tbx-mat-notification-action-outlined-opacity`                 | `var(--...-action-text-opacity)`              | Outlined button label opacity   |
| `--tbx-mat-notification-action-elevated-opacity`                 | `var(--...-action-text-opacity)`              | Elevated button label opacity   |
| `--tbx-mat-notification-action-icon-opacity`                     | `var(--...-action-text-opacity)`              | Action icon button icon opacity |
| `--tbx-mat-notification-close-icon-opacity`                      | `var(--...-action-text-opacity)`              | Close icon button icon opacity  |
| `--tbx-mat-notification-action-filled-hover-state-layer-opacity` | `0.3`                                         | Filled button hover state-layer |
| `--tbx-mat-notification-action-tonal-hover-state-layer-opacity`  | `var(--...-filled-hover-state-layer-opacity)` | Tonal button hover state-layer  |

#### Icon Button Colors

Action and close icon buttons share the same computed color by default. Override these on a panel class to differentiate them per-severity.

| Property                                               | Default                    | Description                          |
| ------------------------------------------------------ | -------------------------- | ------------------------------------ |
| `--tbx-mat-notification-action-icon-color`             | Computed via `color-mix()` | Action icon button icon color        |
| `--tbx-mat-notification-action-icon-state-layer-color` | Panel text color           | Action icon button hover/focus color |
| `--tbx-mat-notification-close-icon-color`              | Computed via `color-mix()` | Close icon button icon color         |
| `--tbx-mat-notification-close-icon-state-layer-color`  | Panel text color           | Close icon button hover/focus color  |

## Styling Font Icons

[Material Symbols ↗](https://fonts.google.com/icons) are variable fonts that expose four CSS axes via `font-variation-settings`. These axes apply to any `<mat-icon>` rendered with a Material Symbols font set. All four axes must be specified together — omitting an axis resets it to the font default.

```css
font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
```

| Axis   | Range   | Default | Description                                                                                                    |
| ------ | ------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `FILL` | 0-1     | 0       | Outlined (0) or filled (1). Use to convey state transitions.                                                   |
| `wght` | 100-700 | 400     | Stroke weight. Higher values produce bolder icons for visual emphasis.                                         |
| `GRAD` | -50-200 | 0       | Grade. Fine-grained weight adjustment without changing icon size. Use -25 to reduce glare on dark backgrounds. |
| `opsz` | 20-48   | 48      | Optical size. Adjusts stroke weight automatically at different display sizes.                                  |

### Filled icons

```css
.mat-mdc-snack-bar-container .material-symbols-rounded {
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

### State transition (outlined to filled)

```css
@keyframes tbx-icon-fill {
    from {
        font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
    to {
        font-variation-settings:
            'FILL' 1,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }
}
.mat-mdc-snack-bar-container .material-symbols-rounded {
    animation: tbx-icon-fill 0.3s ease-in-out 0.15s forwards;
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

### Hover fill

```css
.mat-mdc-snack-bar-container .material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    transition: font-variation-settings 0.3s ease-in-out;
}
.mat-mdc-snack-bar-container .material-symbols-rounded:hover {
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

## API Reference

### TbxMatNotificationService

| Method                          | Returns                 | Description                                                              |
| ------------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `success(message, config?)`     | `TbxMatNotificationRef` | Show a success notification                                              |
| `error(message, config?)`       | `TbxMatNotificationRef` | Show an error notification                                               |
| `warning(message, config?)`     | `TbxMatNotificationRef` | Show a warning notification                                              |
| `information(message, config?)` | `TbxMatNotificationRef` | Show an information notification                                         |
| `help(message, config?)`        | `TbxMatNotificationRef` | Show a help notification                                                 |
| `default(message, config?)`     | `TbxMatNotificationRef` | Show a default notification (no severity styling)                        |
| `show(config)`                  | `TbxMatNotificationRef` | Show a notification with full config                                     |
| `dismiss()`                     | `void`                  | Dismiss current (convenience wrapper, tracks ProgrammaticDismissCurrent) |
| `dismissAll()`                  | `void`                  | Dismiss current and clear queue (tracks ProgrammaticDismissAll)          |
| `isActive()`                    | `Signal<boolean>`       | Whether a notification is visible                                        |
| `pendingCount()`                | `Signal<number>`        | Count of queued notifications                                            |

### TbxMatNotificationRef

Returned synchronously from all service methods.

| Property      | Type                                       | Description                                                  |
| ------------- | ------------------------------------------ | ------------------------------------------------------------ |
| `config`      | `TbxMatNotificationConfig`                 | Consumer's config, available immediately                     |
| `snackBarRef` | `Promise<MatSnackBarRef<unknown> \| null>` | Resolves when displayed, `null` if cleared from queue        |
| `result`      | `Promise<TbxMatNotificationResult>`        | Resolves on dismissal with `TbxMatNotificationDismissReason` |

### TbxMatNotificationDismissReason

| Value                        | Trigger                        |
| ---------------------------- | ------------------------------ |
| `Action`                     | User clicked the action button |
| `Close`                      | User clicked the close button  |
| `Timeout`                    | Auto-dismissed after duration  |
| `ProgrammaticDismissAll`     | `dismissAll()` called          |
| `ProgrammaticDismissCurrent` | `dismiss()` called             |

### TbxMatNotificationConfig

| Property           | Type                                                     | Default | Description                                                         |
| ------------------ | -------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `type`             | `TbxMatSeverityLevel`                                    | -       | Severity level (required)                                           |
| `message`          | `string`                                                 | -       | Message text (required)                                             |
| `duration`         | `number`                                                 | `10000` | Duration in ms. Zero or negative = indefinite.                      |
| `showCountdown`    | `boolean`                                                | `false` | Show countdown bar (only when duration is positive)                 |
| `showSeverityIcon` | `boolean`                                                | `true`  | Show severity icon                                                  |
| `showCloseButton`  | `boolean`                                                | `true`  | Show close/dismiss button                                           |
| `action`           | `TbxMatNotificationAction`                               | -       | Optional action button config                                       |
| `snackBarConfig`   | `Partial<Omit<MatSnackBarConfig, 'data' \| 'duration'>>` | -       | Passthrough for native snackbar config (position, politeness, etc.) |

### TbxMatNotificationAction

| Property                    | Type                                        | Default  | Description                                                       |
| --------------------------- | ------------------------------------------- | -------- | ----------------------------------------------------------------- |
| `label`                     | `string`                                    | -        | Button label (required). Used as `aria-label` for icon buttons.   |
| `iconName`                  | `string`                                    | -        | Icon name resolved by the action icon resolver                    |
| `actionButtonType`          | `MatButtonAppearance \| 'icon'`             | `'text'` | Button appearance (cascades: per-notification, provider, default) |
| `iconPosition`              | `TbxMatNotificationIconPosition`            | `Before` | Icon position relative to label                                   |
| `actionIconResolverService` | `TbxMatIconResolver<string> & { iconType }` | -        | Icon resolver (cascades: per-notification, provider)              |

### TbxMatNotificationProviderConfig

| Property                      | Type                                                                     | Default      | Description                             |
| ----------------------------- | ------------------------------------------------------------------------ | ------------ | --------------------------------------- |
| `severityIconResolverService` | `TbxMatSeverityResolver & TbxMatIconResolver<TbxMatSeverityLevel> & ...` | -            | Severity icon resolver (required)       |
| `closeIconResolverService`    | `TbxMatIconResolver<string> & { iconType }`                              | Default font | Close button icon resolver              |
| `actionConfig`                | `TbxMatNotificationProviderActionConfig`                                 | -            | Application-wide action button defaults |

## Compatibility

| Dependency                                                                             | Version  |
| -------------------------------------------------------------------------------------- | -------- |
| [Angular ↗](https://angular.dev)                                                       | >=21.0.0 |
| [Angular Material ↗](https://material.angular.dev)                                     | >=21.0.0 |
| [@teqbench/tbx-mat-icons](https://github.com/teqbench/tbx-mat-icons)                   | >=4.0.0  |
| [@teqbench/tbx-mat-severity-icons](https://github.com/teqbench/tbx-mat-severity-icons) | >=6.0.0  |
| [TypeScript ↗](https://www.typescriptlang.org)                                         | ~5.9.0   |
| [Node.js ↗](https://nodejs.org)                                                        | >=24.0.0 |

## Feedback

- [Report a bug](https://github.com/teqbench/tbx-mat-notifications/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/teqbench/tbx-mat-notifications/issues/new?template=feature_request.md)

## License

[AGPL-3.0](LICENSE) -- Copyright 2026 TeqBench
