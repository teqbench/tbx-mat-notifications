# @teqbench/tbx-mat-notifications

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-number.json)

> Opinionated Angular notification service built on Material snackbar. Provides severity-leveled methods (success, error, warn, info, help), FIFO queuing with signal-based state, configurable duration/position, and a pure-CSS countdown bar — no JS timers. Designed for Angular 21+ zoneless applications.

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
this.notify.warn('Your session will expire in 5 minutes.');
this.notify.info('New version available.');
this.notify.help('Click the + button to add a new item.');

// Full control via show()
this.notify.show({
  type: TbxMatSeverityLevelType.Warning,
  message: 'Unsaved changes will be lost.',
  duration: 6000,
  showCountdown: true,
});

// Queue state (reactive signals)
this.notify.isActive();      // whether a notification is visible
this.notify.pendingCount();  // notifications waiting in the queue

// Dismiss
this.notify.dismiss();       // dismiss current (next in queue shows)
this.notify.dismissAll();    // clear current + all queued
```

### Icon Service

Notification icons are resolved by the `TBX_MAT_NOTIFICATION_ICON_SERVICE` injection token. The built-in `TbxMatNotificationIconService` provides Material Symbols Rounded ligatures for each severity level.

#### Font set resolution

`TbxMatNotificationIconService` resolves its font set through a fallback chain:

1. **Explicit `fontSet`** passed to the constructor via `useFactory`
2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** from `@teqbench/tbx-mat-icons` (application-level default)
3. **Error** if neither is configured

#### Using the application-level default

If your app already provides `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`, register the icon service with no arguments — it inherits the default automatically:

```typescript
import { TBX_MAT_NOTIFICATION_ICON_SERVICE, TbxMatNotificationIconService } from '@teqbench/tbx-mat-notifications';

providers: [{ provide: TBX_MAT_NOTIFICATION_ICON_SERVICE, useClass: TbxMatNotificationIconService }];
```

#### Overriding the font set per-service

To use a different font set for notification icons without changing the app-wide default:

```typescript
import { TBX_MAT_NOTIFICATION_ICON_SERVICE, TbxMatNotificationIconService } from '@teqbench/tbx-mat-notifications';

providers: [
    {
        provide: TBX_MAT_NOTIFICATION_ICON_SERVICE,
        useFactory: () => new TbxMatNotificationIconService('material-symbols-outlined'),
    },
];
```

#### Providing a fully custom icon service

Subclass `TbxMatSeverityIconService` from `@teqbench/tbx-mat-severity-icons` to map severity levels to your own icon ligatures:

```typescript
import { Injectable } from '@angular/core';
import { TbxMatSeverityIconService } from '@teqbench/tbx-mat-severity-icons';
import { TBX_MAT_NOTIFICATION_ICON_SERVICE } from '@teqbench/tbx-mat-notifications';

@Injectable()
export class MyAppNotificationIconService extends TbxMatSeverityIconService {
    constructor() {
        super('my-custom-icon-font');
    }

    override success() {
        return 'thumbs_up';
    }
    override error() {
        return 'cancel';
    }
    override warning() {
        return 'alert';
    }
    override information() {
        return 'lightbulb';
    }
    override help() {
        return 'question_mark';
    }
}

providers: [{ provide: TBX_MAT_NOTIFICATION_ICON_SERVICE, useClass: MyAppNotificationIconService }];
```

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

| Property                          | Default   | Description             |
| --------------------------------- | --------- | ----------------------- |
| `--tbx-notification-success-bg`   | `#2E7D32` | Success background      |
| `--tbx-notification-success-text` | `#FFFFFF` | Success text/icon color |
| `--tbx-notification-error-bg`     | `#C62828` | Error background        |
| `--tbx-notification-error-text`   | `#FFFFFF` | Error text/icon color   |
| `--tbx-notification-warning-bg`   | `#F9A825` | Warning background      |
| `--tbx-notification-warning-text` | `#FFFFFF` | Warning text/icon color |
| `--tbx-notification-info-bg`      | `#1565C0` | Info background         |
| `--tbx-notification-info-text`    | `#FFFFFF` | Info text/icon color    |
| `--tbx-notification-help-bg`      | `#1976D2` | Help background         |
| `--tbx-notification-help-text`    | `#FFFFFF` | Help text/icon color    |

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

| Method                      | Description                               |
| --------------------------- | ----------------------------------------- |
| `success(message, config?)` | Show a success notification               |
| `error(message, config?)`   | Show an error notification                |
| `warn(message, config?)`    | Show a warning notification               |
| `info(message, config?)`    | Show an info notification                 |
| `help(message, config?)`    | Show a help notification                  |
| `show(config)`              | Show a notification with full config      |
| `dismiss()`                 | Dismiss the current notification          |
| `dismissAll()`              | Dismiss current and clear the queue       |
| `isActive()`                | Signal: whether a notification is visible |
| `pendingCount()`            | Signal: count of queued notifications     |

### TbxMatNotificationConfig

| Property             | Type                            | Default    | Description                        |
| -------------------- | ------------------------------- | ---------- | ---------------------------------- |
| `type`               | `TbxMatSeverityLevelType`       | —          | Severity level (required)          |
| `message`            | `string`                        | —          | Message text (required)            |
| `duration`           | `number`                        | 4000       | Duration in ms (clamped 1000–6000) |
| `horizontalPosition` | `MatSnackBarHorizontalPosition` | `'start'`  | Horizontal position                |
| `verticalPosition`   | `MatSnackBarVerticalPosition`   | `'bottom'` | Vertical position                  |
| `showCountdown`      | `boolean`                       | `false`    | Show countdown progress bar        |

## Compatibility

| Dependency       | Version  |
| ---------------- | -------- |
| Angular          | >=21.0.0 |
| Angular Material | >=21.0.0 |
| TypeScript       | ~5.9.0   |
| Node.js          | >=24.0.0 |

## License

[Apache-2.0](LICENSE) — Copyright 2025 TeqBench
