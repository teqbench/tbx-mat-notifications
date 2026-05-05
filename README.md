# @teqbench/tbx-mat-notifications

![Build Status](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-status.json) ![Tests](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-tests.json) ![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-coverage.json) ![Version](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-version.json) ![Build Number](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/teqbench-shields-bot/a69600f4ed4ebed89ffb35d808e05eb4/raw/tbx-mat-notifications-main-build-number.json)

> An opinionated [Angular ↗](https://angular.dev) notification service built on [Material snackbar ↗](https://material.angular.dev/components/snack-bar/api) with severity-leveled methods for all six tiers (default, success, error, warning, information, help), a FIFO queue, an optional single action button, pluggable severity and close icons, and a pure-CSS countdown bar. Severity colors, enum, abstract icon bases, default icon sets, and the optional inverted palette come from [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme).

<details>
<summary><strong>Table of contents</strong></summary>

- [Overview](#overview)
- [At a glance](#at-a-glance)
- [When to use](#when-to-use)
- [Installation](#installation)
- [Usage](#usage)
- [Concepts](#concepts)
- [API Reference](#api-reference)
- [Styling](#styling)
- [Accessibility](#accessibility)
- [Compatibility](#compatibility)
- [Related packages](#related-packages)
- [Versioning & releases](#versioning--releases)
- [Contributing](#contributing)
- [Security](#security)
- [Feedback](#feedback)
- [License](#license)

</details>

## Overview

`@teqbench/tbx-mat-notifications` provides transient, unobtrusive feedback for [Angular ↗](https://angular.dev) applications. It is a thin, opinionated layer on top of [Angular Material's snackbar ↗](https://material.angular.dev/components/snack-bar/api) that fills the gap left by the bare primitive: severity-leveled convenience methods, a FIFO queue so rapid-fire notifications don't overlap, a synchronous ref returned immediately, and consistent visual treatment across severities.

Consumers `inject(TbxMatNotificationService)` and call `default()`, `success()`, `error()`, `warning()`, `information()`, or `help()` with a message and optional config for the common severity-leveled cases. For full control over every setting — severity, message, duration, countdown visibility, severity-icon visibility, close-button visibility, action button config, and a passthrough to the native [MatSnackBarConfig ↗](https://material.angular.dev/components/snack-bar/api) (position, politeness, custom panel classes) — call `show()` directly with the complete `TbxMatNotificationConfig`.

Each call returns a `TbxMatNotificationRef` synchronously so callers can await the dismissal result without losing their place in the queue. Behind the scenes, if another notification is already visible, the new one waits; when the active one dismisses, the next one opens — no overlap, no fighting over the snackbar slot.

Severity (`default`, `success`, `error`, `warning`, `information`, `help`) drives both the icon and the color scheme. The six CSS custom-property pairs are aliased from the shared [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) tokens, so the five colored tiers stay independent of the active [M3 ↗](https://m3.material.io) theme palette while the `default` tier remains theme-responsive. Applications can opt into an inverted palette (white backgrounds with colored text) across every severity-aware `@teqbench` package by calling `provideTbxMatSeverityTheme({ invert: true })` at bootstrap. An optional single action button supports [Material's ↗](https://material.angular.dev) standard button appearances (`text`, `filled`, `tonal`, `outlined`, `elevated`) plus an icon-only variant, with defaults that cascade from per-notification to provider-level to built-in. A pure-CSS countdown bar (opt-in via `showCountdown`) renders progress toward auto-dismissal without requiring any animation framework.

The library is designed for [Angular ↗](https://angular.dev) 21+ zoneless applications, uses [signal inputs ↗](https://angular.dev/guide/signals/inputs) for reactive state (`isActive()`, `pendingCount()`), and exposes a pluggable icon resolver so consumers can use [Material Symbols ↗](https://fonts.google.com/icons) font icons or bundled SVG icons without changing component code. The native [MatSnackBarRef ↗](https://material.angular.dev/components/snack-bar/api) is exposed via the returned ref's `snackBarRef` promise for consumers that need the underlying instance.

## At a glance

- **Severity-leveled API** — convenience methods for default, success, error, warning, information, and help with matching icons and colors.
- **Material snackbar base** — thin opinionated layer over [Angular Material's ↗](https://material.angular.dev) [MatSnackBar ↗](https://material.angular.dev/components/snack-bar/api) with consistent visual treatment.
- **FIFO queue** — one notification at a time, with signal-based `isActive` and `pendingCount` state.
- **Synchronous ref** — service methods return `TbxMatNotificationRef` immediately, with promises for the native ref and dismiss result.
- **Optional action button** — single action with text, filled, tonal, outlined, elevated, or icon-only appearance and cascading defaults.
- **Dismiss reason tracking** — result promise resolves with Action, Close, Timeout, or one of two programmatic dismiss reasons.
- **Pure-CSS countdown bar** — opt-in visual progress toward auto-dismissal, no animation framework required.
- **Configurable duration** — default 10s; positive values used as-is; zero or negative means indefinite.
- **Theming via CSS custom properties** — per-severity colors, opacity tokens for button variants, and layout gaps exposed as CSS variables.
- **Pluggable icons** — [Material Symbols ↗](https://fonts.google.com/icons) font icons or SVG icon resolver services via DI token, with optional per-action overrides.
- **Native ref exposure** — underlying [MatSnackBarRef ↗](https://material.angular.dev/components/snack-bar/api) available via the returned ref's `snackBarRef` promise for advanced use.
- **Zoneless ready** — built for [Angular ↗](https://angular.dev) 21+ zoneless applications using [signal-based reactive state ↗](https://angular.dev/guide/signals).

## When to use

Notifications are one of three message surfaces in the TeqBench component family. Choose based on the weight of the message and how much interaction it needs:

- **`@teqbench/tbx-mat-notifications`** (this package) — small, transient messages with at most one action control (e.g. an `Undo`, `Retry`, `View`, or `Dismiss` button). Ideally one line of text, two lines acceptable. Use notifications to acknowledge something without interrupting the user's flow.
- [`@teqbench/tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) — wide, persistent messages with multiple action controls (i.e. buttons, checkboxes, toggles, radio groups, toggle groups). Use a banner when the message needs the user's attention and may offer a few follow-up choices.
- [`@teqbench/tbx-mat-dialogs` ↗](https://github.com/teqbench/tbx-mat-dialogs) — heavier, focused interactions for arbitrary content. Use a dialog when the message is long, the choices are many, or the interaction is complex.

If a notification grows beyond one short line or needs more than one action, that's a signal to escalate to a banner.

## Installation

Configure [npm ↗](https://www.npmjs.com) to use [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) for the `@teqbench` scope:

```bash
echo "@teqbench:registry=https://npm.pkg.github.com" >> .npmrc
```

Install the package:

```bash
npm install @teqbench/tbx-mat-notifications
```

### Prerequisites

This package renders inside [Angular Material ↗](https://material.angular.dev)'s snackbar overlay and relies on an active [M3 ↗](https://m3.material.io) theme for typography, shape, and interactive states (button ripples, hover effects). If no [Angular Material ↗](https://material.angular.dev) theme is applied, notifications will render with unstyled browser defaults.

The five colored severity tiers (success = green, error = red, warning = amber, information = blue, help = lighter blue) are **not** tied to the theme palette — their CSS custom properties alias the shared tokens exported by [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) and stay consistent regardless of which theme is active. The sixth tier (`default`) intentionally aliases the Material system `--mat-sys-inverse-surface` / `--mat-sys-inverse-on-surface` tokens so it remains theme-responsive. Inverted styling (white backgrounds, colored text) is available by calling `provideTbxMatSeverityTheme({ invert: true })` at bootstrap — note the flag applies app-wide across every `@teqbench` severity-aware package, not notifications alone.

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
void this.notify.default('Syncing...');
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
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

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

- **Not set** — defaults to 10000ms.
- **Positive** — used as-is, no clamping.
- **Zero or negative** — indefinite (no auto-dismiss; only dismissed by action, close, or programmatic dismiss).

For notifications with an action button, a longer duration is recommended (e.g. 30000ms) to give users time to read and respond.

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
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

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

## Concepts

- **Severity level** — a classification (success, error, warning, information, help) that selects the icon and color scheme applied to a notification.
- **Action button** — an optional single button rendered inside the notification; its click resolves the dismiss result with reason `Action`.
- **Dismiss reason** — the cause of a notification closing: action button, close button, timeout, or one of two programmatic paths (single or all).
- **Queue** — a FIFO list of pending notifications. One is visible at a time; queued notifications render in order as each resolves.
- **Countdown bar** — a pure-CSS progress bar rendered along the notification's edge that depletes over the configured duration. Opt-in via `showCountdown`.
- **Provider config** — the DI-provided configuration (`TBX_MAT_NOTIFICATION_PROVIDER_CONFIG`) that supplies the severity icon resolver, optional close icon resolver, and application-wide action defaults.
- **Action appearance cascade** — per-notification `action.actionButtonType` overrides the provider's `actionConfig.buttonType`, which in turn overrides the built-in default of `'text'`.
- **Icon resolver service** — a pluggable service that maps a severity level or a named icon to either a [Material Symbols ↗](https://fonts.google.com/icons) ligature (font) or an SVG markup string.

## API Reference

### TbxMatNotificationService

<dl>
    <dt><code>success(message, config?)</code></dt>
    <dd>Show a success notification. Returns: <code>TbxMatNotificationRef</code>.</dd>
    <dt><code>error(message, config?)</code></dt>
    <dd>Show an error notification. Returns: <code>TbxMatNotificationRef</code>.</dd>
    <dt><code>warning(message, config?)</code></dt>
    <dd>Show a warning notification. Returns: <code>TbxMatNotificationRef</code>.</dd>
    <dt><code>information(message, config?)</code></dt>
    <dd>Show an information notification. Returns: <code>TbxMatNotificationRef</code>.</dd>
    <dt><code>help(message, config?)</code></dt>
    <dd>Show a help notification. Returns: <code>TbxMatNotificationRef</code>.</dd>
    <dt><code>default(message, config?)</code></dt>
    <dd>Show a default notification (no severity styling). Returns: <code>TbxMatNotificationRef</code>.</dd>
    <dt><code>show(config)</code></dt>
    <dd>Show a notification with full config. Returns: <code>TbxMatNotificationRef</code>.</dd>
    <dt><code>dismiss()</code></dt>
    <dd>Dismiss current (convenience wrapper, tracks ProgrammaticDismissCurrent). Returns: <code>void</code>.</dd>
    <dt><code>dismissAll()</code></dt>
    <dd>Dismiss current and clear queue (tracks ProgrammaticDismissAll). Returns: <code>void</code>.</dd>
    <dt><code>isActive()</code></dt>
    <dd>Whether a notification is visible. Returns: <code>Signal&lt;boolean&gt;</code>.</dd>
    <dt><code>pendingCount()</code></dt>
    <dd>Count of queued notifications. Returns: <code>Signal&lt;number&gt;</code>.</dd>
</dl>

### TbxMatNotificationRef

Returned synchronously from all service methods.

<dl>
    <dt><code>config</code> (<code>TbxMatNotificationConfig</code>)</dt>
    <dd>Consumer's config, available immediately.</dd>
    <dt><code>snackBarRef</code> (<code>Promise&lt;MatSnackBarRef&lt;unknown&gt; | null&gt;</code>)</dt>
    <dd>Resolves when displayed, <code>null</code> if cleared from queue.</dd>
    <dt><code>result</code> (<code>Promise&lt;TbxMatNotificationResult&gt;</code>)</dt>
    <dd>Resolves on dismissal with <code>TbxMatNotificationDismissReason</code>.</dd>
</dl>

### TbxMatNotificationDismissReason

<dl>
    <dt><code>Action</code></dt>
    <dd>User clicked the action button.</dd>
    <dt><code>Close</code></dt>
    <dd>User clicked the close button.</dd>
    <dt><code>Timeout</code></dt>
    <dd>Auto-dismissed after duration.</dd>
    <dt><code>ProgrammaticDismissAll</code></dt>
    <dd><code>dismissAll()</code> called.</dd>
    <dt><code>ProgrammaticDismissCurrent</code></dt>
    <dd><code>dismiss()</code> called.</dd>
</dl>

### TbxMatNotificationConfig

<dl>
    <dt><code>type</code> (<code>TbxMatSeverityLevel</code>)</dt>
    <dd>Severity level (required).</dd>
    <dt><code>message</code> (<code>string</code>)</dt>
    <dd>Message text (required).</dd>
    <dt><code>duration</code> (<code>number</code>)</dt>
    <dd>Duration in ms. Zero or negative = indefinite. Default: <code>10000</code>.</dd>
    <dt><code>showCountdown</code> (<code>boolean</code>)</dt>
    <dd>Show countdown bar (only when duration is positive). Default: <code>false</code>.</dd>
    <dt><code>showSeverityIcon</code> (<code>boolean</code>)</dt>
    <dd>Show severity icon. Default: <code>true</code>.</dd>
    <dt><code>showCloseButton</code> (<code>boolean</code>)</dt>
    <dd>Show close/dismiss button. Default: <code>true</code>.</dd>
    <dt><code>action</code> (<code>TbxMatNotificationAction</code>)</dt>
    <dd>Optional action button config.</dd>
    <dt><code>snackBarConfig</code> (<code>Partial&lt;Omit&lt;MatSnackBarConfig, 'data' | 'duration'&gt;&gt;</code>)</dt>
    <dd>Passthrough for native snackbar config (position, politeness, etc.).</dd>
</dl>

### TbxMatNotificationAction

<dl>
    <dt><code>label</code> (<code>string</code>)</dt>
    <dd>Button label (required). Used as <code>aria-label</code> for icon buttons.</dd>
    <dt><code>iconName</code> (<code>string</code>)</dt>
    <dd>Icon name resolved by the action icon resolver.</dd>
    <dt><code>actionButtonType</code> (<code>MatButtonAppearance | 'icon'</code>)</dt>
    <dd>Button appearance (cascades: per-notification, provider, default). Default: <code>'text'</code>.</dd>
    <dt><code>iconPosition</code> (<code>TbxMatNotificationIconPosition</code>)</dt>
    <dd>Icon position relative to label. Default: <code>Before</code>.</dd>
    <dt><code>actionIconResolverService</code> (<code>TbxMatIconResolver&lt;string&gt; &amp; { iconType }</code>)</dt>
    <dd>Icon resolver (cascades: per-notification, provider).</dd>
</dl>

### TbxMatNotificationProviderConfig

<dl>
    <dt><code>severityIconResolverService</code> (<code>TbxMatSeverityResolver &amp; TbxMatIconResolver&lt;TbxMatSeverityLevel&gt; &amp; ...</code>)</dt>
    <dd>Severity icon resolver (required).</dd>
    <dt><code>closeIconResolverService</code> (<code>TbxMatIconResolver&lt;string&gt; &amp; { iconType }</code>)</dt>
    <dd>Close button icon resolver. Default: Default font.</dd>
    <dt><code>actionConfig</code> (<code>TbxMatNotificationProviderActionConfig</code>)</dt>
    <dd>Application-wide action button defaults.</dd>
</dl>

## Styling

Notification appearance is customizable via CSS custom properties. Set them globally on `html` or scope them to a panel class for per-severity overrides.

### Layout

<dl>
    <dt><code>--tbx-mat-notification-padding</code></dt>
    <dd>Host element padding. Default: <code>0.25rem</code>.</dd>
    <dt><code>--tbx-mat-notification-font-size</code></dt>
    <dd>Message text size. Default: <code>inherit</code>.</dd>
    <dt><code>--tbx-mat-notification-icon-size</code></dt>
    <dd>Severity icon size. Default: <code>1.5rem</code>.</dd>
    <dt><code>--tbx-mat-notification-label-gap</code></dt>
    <dd>Gap between icon and message. Default: <code>1rem</code>.</dd>
    <dt><code>--tbx-mat-notification-actions-padding</code></dt>
    <dd>Padding before actions area. Default: <code>1rem</code>.</dd>
    <dt><code>--tbx-mat-notification-actions-gap</code></dt>
    <dd>Gap between action and close buttons. Default: <code>0.5rem</code>.</dd>
    <dt><code>--tbx-mat-notification-countdown-height</code></dt>
    <dd>Countdown bar thickness. Default: <code>0.1875rem</code>.</dd>
    <dt><code>--tbx-mat-notification-countdown-opacity</code></dt>
    <dd>Countdown bar opacity. Default: <code>0.4</code>.</dd>
</dl>

### Colors

<dl>
    <dt><code>--tbx-mat-notification-success-background</code></dt>
    <dd>Success background. Default: <code>#2E7D32</code>.</dd>
    <dt><code>--tbx-mat-notification-success-text</code></dt>
    <dd>Success text/icon color. Default: <code>#FFFFFF</code>.</dd>
    <dt><code>--tbx-mat-notification-error-background</code></dt>
    <dd>Error background. Default: <code>#C62828</code>.</dd>
    <dt><code>--tbx-mat-notification-error-text</code></dt>
    <dd>Error text/icon color. Default: <code>#FFFFFF</code>.</dd>
    <dt><code>--tbx-mat-notification-warning-background</code></dt>
    <dd>Warning background. Default: <code>#F9A825</code>.</dd>
    <dt><code>--tbx-mat-notification-warning-text</code></dt>
    <dd>Warning text/icon color. Default: <code>#FFFFFF</code>.</dd>
    <dt><code>--tbx-mat-notification-information-background</code></dt>
    <dd>Information background. Default: <code>#1565C0</code>.</dd>
    <dt><code>--tbx-mat-notification-information-text</code></dt>
    <dd>Information text/icon color. Default: <code>#FFFFFF</code>.</dd>
    <dt><code>--tbx-mat-notification-help-background</code></dt>
    <dd>Help background. Default: <code>#1976D2</code>.</dd>
    <dt><code>--tbx-mat-notification-help-text</code></dt>
    <dd>Help text/icon color. Default: <code>#FFFFFF</code>.</dd>
</dl>

### Action Button Opacity

Control the transparency of action button elements relative to the panel's text color. All variant tokens default to `--tbx-mat-notification-action-text-opacity` unless overridden. Set on `html` globally or on a panel class for per-severity overrides.

<dl>
    <dt><code>--tbx-mat-notification-action-text-opacity</code></dt>
    <dd>Text button label opacity. Default: <code>0.8</code>.</dd>
    <dt><code>--tbx-mat-notification-action-filled-container-opacity</code></dt>
    <dd>Filled button container opacity. Default: <code>var(--...-action-text-opacity)</code>.</dd>
    <dt><code>--tbx-mat-notification-action-tonal-container-opacity</code></dt>
    <dd>Tonal button container opacity. Default: <code>0.55</code>.</dd>
    <dt><code>--tbx-mat-notification-action-outlined-opacity</code></dt>
    <dd>Outlined button label opacity. Default: <code>var(--...-action-text-opacity)</code>.</dd>
    <dt><code>--tbx-mat-notification-action-elevated-opacity</code></dt>
    <dd>Elevated button label opacity. Default: <code>var(--...-action-text-opacity)</code>.</dd>
    <dt><code>--tbx-mat-notification-action-icon-opacity</code></dt>
    <dd>Action icon button icon opacity. Default: <code>var(--...-action-text-opacity)</code>.</dd>
    <dt><code>--tbx-mat-notification-close-icon-opacity</code></dt>
    <dd>Close icon button icon opacity. Default: <code>var(--...-action-text-opacity)</code>.</dd>
    <dt><code>--tbx-mat-notification-action-filled-hover-state-layer-opacity</code></dt>
    <dd>Filled button hover state-layer. Default: <code>0.3</code>.</dd>
    <dt><code>--tbx-mat-notification-action-tonal-hover-state-layer-opacity</code></dt>
    <dd>Tonal button hover state-layer. Default: <code>var(--...-filled-hover-state-layer-opacity)</code>.</dd>
</dl>

### Icon Button Colors

Action and close icon buttons share the same computed color by default. Override these on a panel class to differentiate them per-severity.

<dl>
    <dt><code>--tbx-mat-notification-action-icon-color</code></dt>
    <dd>Action icon button icon color. Default: Computed via <code>color-mix()</code>.</dd>
    <dt><code>--tbx-mat-notification-action-icon-state-layer-color</code></dt>
    <dd>Action icon button hover/focus color. Default: Panel text color.</dd>
    <dt><code>--tbx-mat-notification-close-icon-color</code></dt>
    <dd>Close icon button icon color. Default: Computed via <code>color-mix()</code>.</dd>
    <dt><code>--tbx-mat-notification-close-icon-state-layer-color</code></dt>
    <dd>Close icon button hover/focus color. Default: Panel text color.</dd>
</dl>

### Styling Font Icons

[Material Symbols ↗](https://fonts.google.com/icons) are variable fonts that expose four CSS axes via `font-variation-settings`. These axes apply to any `<mat-icon>` rendered with a Material Symbols font set. All four axes must be specified together — omitting an axis resets it to the font default.

```css
font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
```

<dl>
    <dt><code>FILL</code></dt>
    <dd>Outlined (0) or filled (1). Use to convey state transitions. Range: 0-1. Default: 0.</dd>
    <dt><code>wght</code></dt>
    <dd>Stroke weight. Higher values produce bolder icons for visual emphasis. Range: 100-700. Default: 400.</dd>
    <dt><code>GRAD</code></dt>
    <dd>Grade. Fine-grained weight adjustment without changing icon size. Use -25 to reduce glare on dark backgrounds. Range: -50-200. Default: 0.</dd>
    <dt><code>opsz</code></dt>
    <dd>Optical size. Adjusts stroke weight automatically at different display sizes. Range: 20-48. Default: 48.</dd>
</dl>

#### Filled icons

```css
.mat-mdc-snack-bar-container .material-symbols-rounded {
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}
```

#### State transition (outlined to filled)

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

#### Hover fill

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

## Accessibility

- **Snackbar container.** Notifications render inside [Angular Material's snackbar overlay ↗](https://material.angular.dev/components/snack-bar/api), which announces new snackbars to assistive technology via its built-in politeness handling. Consumers can pass `politeness` through the `snackBarConfig` passthrough on `TbxMatNotificationConfig` to customize the announcement level (`'polite'`, `'assertive'`, or `'off'`).
- **Keyboard.** The action button and close button are focusable in DOM order. `Enter` and `Space` activate them; the native [Material button ↗](https://material.angular.dev) keyboard behavior is preserved.
- **Focus.** Focus is not moved into the notification — they are non-blocking surfaces and should not steal focus from the user's current task.
- **Action button labeling.** Icon-only action buttons (`actionButtonType: 'icon'`) use the `label` field as the button's `aria-label`, so screen readers announce the action's purpose even when no visible text is rendered.
- **Close button labeling.** The close button has a fixed `aria-label="Dismiss notification"` so its purpose is announced consistently across severities and configurations.
- **Severity icons.** Severity icons are decorative and marked `aria-hidden`; the severity meaning is carried by the message text itself, not by the icon alone.
- **Color contrast.** The default severity palette meets [WCAG ↗](https://www.w3.org/WAI/standards-guidelines/wcag/) AA contrast for body text on each background. Overriding the severity CSS custom properties is the consumer's responsibility to re-verify.

## Compatibility

<!-- Kept as a pipe table until teqbench/.github#22 lands; the centralized CI README version-check regex extracts versions from this exact shape. -->

| Dependency                                                                               | Version  |
| ---------------------------------------------------------------------------------------- | -------- |
| [Angular ↗](https://angular.dev)                                                         | >=21.0.0 |
| [Angular Material ↗](https://material.angular.dev)                                       | >=21.0.0 |
| [@teqbench/tbx-mat-icons ↗](https://github.com/teqbench/tbx-mat-icons)                   | >=4.2.0  |
| [@teqbench/tbx-mat-severity-theme ↗](https://github.com/teqbench/tbx-mat-severity-theme) | >=8.0.2  |
| [TypeScript ↗](https://www.typescriptlang.org)                                           | ~5.9.0   |
| [Node.js ↗](https://nodejs.org)                                                          | >=24.0.0 |

## Related packages

- [`@teqbench/tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) — wider, persistent messages with multiple action controls for more involved interactions.
- [`@teqbench/tbx-mat-dialogs` ↗](https://github.com/teqbench/tbx-mat-dialogs) — modal dialogs for heavier, focused interactions with arbitrary content.
- [`@teqbench/tbx-mat-severity-theme` ↗](https://github.com/teqbench/tbx-mat-severity-theme) — severity enum, abstract icon-service bases, default icon sets, shared SCSS color tokens, and the inverted-palette provider helper consumed by this package.
- [`@teqbench/tbx-mat-icons` ↗](https://github.com/teqbench/tbx-mat-icons) — shared icon resolver contracts and base services.

## Versioning & releases

This package follows [Semantic Versioning ↗](https://semver.org). Versions and changelog entries are produced automatically by [Release Please ↗](https://github.com/googleapis/release-please) from [Conventional Commits ↗](https://www.conventionalcommits.org) on `main`. See [CHANGELOG.md](CHANGELOG.md) for the full release history.

## Contributing

Contributions are welcome. See the [contributing guide ↗](https://github.com/teqbench/.github/blob/main/CONTRIBUTING.md) for local setup, [GitHub Packages ↗](https://github.com/orgs/teqbench/packages) authentication, branch conventions, commit format, and the PR workflow.

## Security

See the [security policy ↗](https://github.com/teqbench/.github/blob/main/SECURITY.md) for the supported-version policy and how to report a vulnerability privately.

## Feedback

- [Report a bug ↗](https://github.com/teqbench/tbx-mat-notifications/issues/new?template=bug_report.md)
- [Request a feature ↗](https://github.com/teqbench/tbx-mat-notifications/issues/new?template=feature_request.md)

## License

[AGPL-3.0](LICENSE) — Copyright 2026 TeqBench
