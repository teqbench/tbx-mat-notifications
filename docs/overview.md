---
tagline: An opinionated [Angular ↗](https://angular.dev) notification service built on [Material snackbar ↗](https://material.angular.dev/components/snack-bar/api) with severity-leveled (i.e. success, error, warning, information, help) methods, a FIFO queue, an optional single action button, pluggable severity and close icons, and a pure-CSS countdown bar.
---

## Overview

`@teqbench/tbx-mat-notifications` provides transient, unobtrusive feedback for [Angular ↗](https://angular.dev) applications. It is a thin, opinionated layer on top of [Angular Material's snackbar ↗](https://material.angular.dev/components/snack-bar/api) that fills the gap left by the bare primitive: severity-leveled convenience methods, a FIFO queue so rapid-fire notifications don't overlap, a synchronous ref returned immediately, and consistent visual treatment across severities.

Consumers `inject(TbxMatNotificationService)` and call `success()`, `error()`, `warning()`, `information()`, `help()`, or `default()` with a message and optional config for the common severity-leveled cases. For full control over every setting — severity, message, duration, countdown visibility, severity-icon visibility, close-button visibility, action button config, and a passthrough to the native [MatSnackBarConfig ↗](https://material.angular.dev/components/snack-bar/api) (position, politeness, custom panel classes) — call `show()` directly with the complete `TbxMatNotificationConfig`.

Each call returns a `TbxMatNotificationRef` synchronously so callers can await the dismissal result without losing their place in the queue. Behind the scenes, if another notification is already visible, the new one waits; when the active one dismisses, the next one opens — no overlap, no fighting over the snackbar slot.

Severity (`success`, `error`, `warning`, `information`, `help`) drives both the icon and the color scheme via dedicated CSS custom properties, independent of the active [M3 ↗](https://m3.material.io) theme palette. An optional single action button supports [Material's ↗](https://material.angular.dev) standard button appearances (`text`, `filled`, `tonal`, `outlined`, `elevated`) plus an icon-only variant, with defaults that cascade from per-notification to provider-level to built-in. A pure-CSS countdown bar (opt-in via `showCountdown`) renders progress toward auto-dismissal without requiring any animation framework.

The library is designed for [Angular ↗](https://angular.dev) 21+ zoneless applications, uses [signal inputs ↗](https://angular.dev/guide/signals/inputs) for reactive state (`isActive()`, `pendingCount()`), and exposes a pluggable icon resolver so consumers can use [Material Symbols ↗](https://fonts.google.com/icons) font icons or bundled SVG icons without changing component code. The native [MatSnackBarRef ↗](https://material.angular.dev/components/snack-bar/api) is exposed via the returned ref's `snackBarRef` promise for consumers that need the underlying instance.

## When to use

Notifications are one of three message surfaces in the TeqBench component family. Choose based on the weight of the message and how much interaction it needs:

- **`@teqbench/tbx-mat-notifications`** (this package) — small, transient messages with at most one action control (e.g. an `Undo`, `Retry`, `View`, or `Dismiss` button). Ideally one line of text, two lines acceptable. Use notifications to acknowledge something without interrupting the user's flow.
- [`@teqbench/tbx-mat-banners` ↗](https://github.com/teqbench/tbx-mat-banners) — wide, persistent messages with multiple action controls (i.e. buttons, checkboxes, toggles, radio groups, toggle groups). Use a banner when the message needs the user's attention and may offer a few follow-up choices.
- [`@teqbench/tbx-mat-dialogs` ↗](https://github.com/teqbench/tbx-mat-dialogs) — heavier, focused interactions for arbitrary content. Use a dialog when the message is long, the choices are many, or the interaction is complex.

If a notification grows beyond one short line or needs more than one action, that's a signal to escalate to a banner.
