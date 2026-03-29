# @teqbench/tbx-mat-notifications

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-number.json)

> Opinionated notification service for Angular Material projects, built on the Material Snackbar component. Provides `TbxMatNotificationService` with severity-leveled methods (`success()`, `error()`, `warning()`, `information()`, `help()`), FIFO queuing with signal-based state, configurable duration/position, optional severity icon and close button visibility, and a pure-CSS countdown bar — no JS timers. Supports both font and SVG icons via `TBX_MAT_NOTIFICATION_PROVIDER_CONFIG`.

## Installation

Configure npm to use GitHub Packages for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/tbx-mat-notifications
```

### Prerequisites

This package renders inside Angular Material's snackbar overlay and relies on an **active M3 theme** for typography, shape (border-radius), and interactive states (button ripples, hover effects). If no Material theme is applied, notifications will render with unstyled browser defaults.

Notification severity colors (success = green, error = red, etc.) are **not** tied to the theme palette — they use dedicated CSS custom properties and remain consistent regardless of which theme is active.

Import the global notification styles in your application's stylesheet:

```scss
@use '@teqbench/tbx-mat-notifications/styles/tbx-mat-notifications';
```

## Usage

```typescript
import { TbxMatNotificationService, TbxMatSeverityLevelType } from '@teqbench/tbx-mat-notifications';

// Inject the service
private readonly notify = inject(TbxMatNotificationService);

// Convenience methods
this.notify.success('Item saved successfully.');
this.notify.error('Failed to load data. Please try again.');
this.notify.warning('Your session will expire in 5 minutes.');
this.notify.information('New version available.');
this.notify.help('Click the + button to add a new item.');

// Full control via show()
this.notify.show({
  type: TbxMatSeverityLevelType.Warning,
  message: 'Unsaved changes will be lost.',
  duration: 6000,
  showCountdown: true,
  showSeverityIcon: false,
  showCloseButton: false,
});

// Queue state (reactive signals)
this.notify.isActive();      // whether a notification is visible
this.notify.pendingCount();  // notifications waiting in the queue

// Dismiss
this.notify.dismiss();       // dismiss current (next in queue shows)
this.notify.dismissAll();    // clear current + all queued
```

### Icon Configuration

Icons are configured via the `TBX_MAT_NOTIFICATION_PROVIDER_CONFIG` injection token. The config provides a severity icon resolver service and an optional close icon override.

When not provided, the component falls back to hardcoded Material Symbols font ligatures for severity icons and uses `close` for the dismiss button.

#### Font icons with `MAT_ICON_DEFAULT_OPTIONS`

When the app already configures the global font set via `MAT_ICON_DEFAULT_OPTIONS`, the font icon service picks it up automatically — no explicit fontSet argument needed:

```typescript
// app.config.ts
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import {
    TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    TbxMatNotificationFontIconService,
} from '@teqbench/tbx-mat-notifications';

providers: [
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
    {
        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatNotificationFontIconService(),
        }),
    },
];
```

#### Font icons with explicit fontSet

Pass the fontSet directly to use a specific font regardless of global configuration:

```typescript
// app.config.ts
import {
    TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    TbxMatNotificationFontIconService,
} from '@teqbench/tbx-mat-notifications';

providers: [
    {
        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
        }),
    },
];
```

#### Font icons with `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token

Use the `@teqbench/tbx-mat-icons` application-level default:

```typescript
// app.config.ts
import {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
} from '@teqbench/tbx-mat-icons';
import {
    TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    TbxMatNotificationFontIconService,
} from '@teqbench/tbx-mat-notifications';

providers: [
    { provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED },
    {
        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new TbxMatNotificationFontIconService(),
        }),
    },
];
```

#### SVG icons

Subclass `TbxMatNotificationSvgIconService` to register your own SVG markup:

```typescript
import { Injectable } from '@angular/core';
import { TbxMatNotificationSvgIconService } from '@teqbench/tbx-mat-notifications';
import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';

@Injectable()
export class MyNotificationSvgIcons extends TbxMatNotificationSvgIconService {
    constructor() {
        super();
        this.register(TbxMatSeverityLevelType.Success, '<svg>...</svg>');
        this.register(TbxMatSeverityLevelType.Error, '<svg>...</svg>');
        this.register(TbxMatSeverityLevelType.Warning, '<svg>...</svg>');
        this.register(TbxMatSeverityLevelType.Information, '<svg>...</svg>');
        this.register(TbxMatSeverityLevelType.Help, '<svg>...</svg>');
    }
}
```

```typescript
// app.config.ts
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '@teqbench/tbx-mat-notifications';

providers: [
    {
        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
        useFactory: () => ({
            severityIconResolverService: new MyNotificationSvgIcons(),
        }),
    },
];
```

#### Custom close icon

Override the dismiss button icon via the `closeIcon` property.

Font close icon — use any ligature name from the active font set:

```typescript
{
    provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    useFactory: () => ({
        severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
        closeIcon: { name: 'cancel', type: 'font' },
    }),
}
```

SVG close icon — the SVG must be registered with `MatIconRegistry` before the notification component renders. Register it in the `useFactory` via `inject()`:

```typescript
import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
    TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    TbxMatNotificationFontIconService,
} from '@teqbench/tbx-mat-notifications';

{
    provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
    useFactory: () => {
        const registry = inject(MatIconRegistry);
        const sanitizer = inject(DomSanitizer);
        registry.addSvgIconLiteral(
            'my-close-icon',
            sanitizer.bypassSecurityTrustHtml('<svg>...</svg>'),
        );

        return {
            severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
            closeIcon: { name: 'my-close-icon', type: 'svg' },
        };
    },
}
```

When omitted, defaults to `{ name: 'close', type: 'font' }`.

### CSS Custom Properties

Notification appearance is customizable via CSS custom properties. Set them globally on `html` or scope them to a panel class for per-severity overrides.

#### Layout

| Property                                   | Default     | Description                   |
| ------------------------------------------ | ----------- | ----------------------------- |
| `--tbx-mat-notification-padding`           | `0.25rem`   | Host element padding          |
| `--tbx-mat-notification-font-size`         | `inherit`   | Message text size             |
| `--tbx-mat-notification-icon-size`         | `1.5rem`    | Severity icon size            |
| `--tbx-mat-notification-label-gap`         | `1rem`      | Gap between icon and message  |
| `--tbx-mat-notification-actions-padding`   | `1rem`      | Padding before dismiss button |
| `--tbx-mat-notification-countdown-height`  | `0.1875rem` | Countdown bar thickness       |
| `--tbx-mat-notification-countdown-opacity` | `0.4`       | Countdown bar opacity         |

#### Colors

| Property                          | Default                                                            | Description             |
| --------------------------------- | ------------------------------------------------------------------ | ----------------------- |
| `--tbx-notification-success-bg`   | ![#2E7D32](https://placehold.co/15x15/2E7D32/2E7D32.png) `#2E7D32` | Success background      |
| `--tbx-notification-success-text` | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Success text/icon color |
| `--tbx-notification-error-bg`     | ![#C62828](https://placehold.co/15x15/C62828/C62828.png) `#C62828` | Error background        |
| `--tbx-notification-error-text`   | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Error text/icon color   |
| `--tbx-notification-warning-bg`   | ![#F9A825](https://placehold.co/15x15/F9A825/F9A825.png) `#F9A825` | Warning background      |
| `--tbx-notification-warning-text` | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Warning text/icon color |
| `--tbx-notification-info-bg`      | ![#1565C0](https://placehold.co/15x15/1565C0/1565C0.png) `#1565C0` | Info background         |
| `--tbx-notification-info-text`    | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Info text/icon color    |
| `--tbx-notification-help-bg`      | ![#1976D2](https://placehold.co/15x15/1976D2/1976D2.png) `#1976D2` | Help background         |
| `--tbx-notification-help-text`    | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF` | Help text/icon color    |

#### Examples

Override globally:

```scss
html {
    --tbx-mat-notification-icon-size: 1.25rem;
    --tbx-mat-notification-font-size: 0.875rem;
    --tbx-mat-notification-countdown-height: 0.125rem;
}
```

Override per severity:

```scss
.tbx-mat-notification-snackbar-error {
    --tbx-mat-notification-icon-size: 1.75rem;
}
```

Override colors for a dark theme:

```scss
html[data-theme='dark'] {
    --tbx-notification-success-bg: #388e3c;
    --tbx-notification-error-bg: #d32f2f;
}
```

## API Reference

### TbxMatNotificationService

| Method                          | Description                               |
| ------------------------------- | ----------------------------------------- |
| `success(message, config?)`     | Show a success notification               |
| `error(message, config?)`       | Show an error notification                |
| `warning(message, config?)`     | Show a warning notification               |
| `information(message, config?)` | Show an information notification          |
| `help(message, config?)`        | Show a help notification                  |
| `show(config)`                  | Show a notification with full config      |
| `dismiss()`                     | Dismiss the current notification          |
| `dismissAll()`                  | Dismiss current and clear the queue       |
| `isActive()`                    | Signal: whether a notification is visible |
| `pendingCount()`                | Signal: count of queued notifications     |

### TbxMatNotificationConfig

| Property             | Type                            | Default    | Description                        |
| -------------------- | ------------------------------- | ---------- | ---------------------------------- |
| `type`               | `TbxMatSeverityLevelType`       | —          | Severity level (required)          |
| `message`            | `string`                        | —          | Message text (required)            |
| `duration`           | `number`                        | 4000       | Duration in ms (clamped 1000–6000) |
| `horizontalPosition` | `MatSnackBarHorizontalPosition` | `'start'`  | Horizontal position                |
| `verticalPosition`   | `MatSnackBarVerticalPosition`   | `'bottom'` | Vertical position                  |
| `showCountdown`      | `boolean`                       | `false`    | Show countdown progress bar        |
| `showSeverityIcon`   | `boolean`                       | `true`     | Show severity icon                 |
| `showCloseButton`    | `boolean`                       | `true`     | Show close/dismiss button          |

### TbxMatNotificationProviderConfig

| Property                      | Type                                                                     | Default                           | Description                       |
| ----------------------------- | ------------------------------------------------------------------------ | --------------------------------- | --------------------------------- |
| `severityIconResolverService` | `ITbxMatSeverityResolver & ITbxMatIconResolver<TbxMatSeverityLevelType>` | —                                 | Severity icon resolver (required) |
| `closeIcon`                   | `{ name: string; type: 'font' \| 'svg' }`                                | `{ name: 'close', type: 'font' }` | Dismiss button icon               |

### TBX_MAT_NOTIFICATION_PROVIDER_CONFIG

`InjectionToken<TbxMatNotificationProviderConfig>` — Provide in `app.config.ts` to configure severity icons and the close button icon. When not provided, the component falls back to hardcoded Material Symbols font ligatures.

### TbxMatNotificationFontIconService

Default font-based severity icon service. Extends `TbxMatFontIconService<TbxMatSeverityLevelType>` and implements `ITbxMatSeverityResolver`. Provides Material Symbols ligatures for each severity level.

### TbxMatNotificationSvgIconService

Default SVG-based severity icon service. Extends `TbxMatSvgIconService<TbxMatSeverityLevelType>` and implements `ITbxMatSeverityResolver`. Subclass and call `this.register()` to provide SVG markup for each severity level.

## Compatibility

| Dependency                       | Version  |
| -------------------------------- | -------- |
| Angular                          | >=21.0.0 |
| Angular Material                 | >=21.0.0 |
| @teqbench/tbx-mat-icons          | >=3.0.0  |
| @teqbench/tbx-mat-severity-icons | >=3.0.0  |
| TypeScript                       | ~5.9.0   |
| Node.js                          | >=24.0.0 |

## License

[Apache-2.0](LICENSE) — Copyright 2025 TeqBench
