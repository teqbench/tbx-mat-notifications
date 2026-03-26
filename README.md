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
import { NotificationService, SeverityLevelType } from '@teqbench/tbx-mat-notifications';

// Inject the service
private readonly notify = inject(NotificationService);

// Convenience methods
this.notify.success('Item saved successfully.');
this.notify.error('Failed to load data. Please try again.');
this.notify.warn('Your session will expire in 5 minutes.');
this.notify.info('New version available.');
this.notify.help('Click the + button to add a new item.');

// Full control via show()
this.notify.show({
  type: SeverityLevelType.Warning,
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

### Custom Icon Service

Provide a custom `SeverityIconService` via the `NOTIFICATION_ICON_SERVICE` token:

```typescript
import { NOTIFICATION_ICON_SERVICE, NotificationIconService } from '@teqbench/tbx-mat-notifications';

providers: [{ provide: NOTIFICATION_ICON_SERVICE, useClass: NotificationIconService }];
```

## API Reference

### NotificationService

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

### NotificationConfig

| Property             | Type                            | Default    | Description                        |
| -------------------- | ------------------------------- | ---------- | ---------------------------------- |
| `type`               | `SeverityLevelType`             | —          | Severity level (required)          |
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
