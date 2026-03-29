import type {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';

/**
 * Configuration for a single notification.
 *
 * Passed to {@link TbxMatNotificationService.show} for full control over
 * severity level, message, duration, position, countdown behavior,
 * icon visibility, and close button visibility.
 * The convenience methods (`success()`, `error()`, `warning()`, `information()`,
 * `help()`) set `type` automatically — use this interface directly when
 * you need to specify all options.
 *
 * @example Full control via show():
 * ```typescript
 * import { TbxMatNotificationService, TbxMatSeverityLevelType } from '@teqbench/tbx-mat-notifications';
 *
 * private readonly notify = inject(TbxMatNotificationService);
 *
 * this.notify.show({
 *     type: TbxMatSeverityLevelType.Warning,
 *     message: 'Unsaved changes will be lost.',
 *     duration: 6000,
 *     showCountdown: true,
 *     horizontalPosition: 'center',
 *     verticalPosition: 'top',
 * });
 * ```
 *
 * @example Using convenience methods with optional overrides:
 * ```typescript
 * // Type is set automatically; override duration and countdown:
 * this.notify.success('Item saved.', { duration: 2000, showCountdown: true });
 *
 * // Hide the severity icon:
 * this.notify.warning('Low disk space.', { showSeverityIcon: false });
 *
 * // Auto-dismiss only (no close button):
 * this.notify.information('Syncing...', { showCloseButton: false, showCountdown: true });
 * ```
 */
export interface TbxMatNotificationConfig {
    /** Severity level — determines the icon, panel color, and CSS class applied to the snackbar. */
    readonly type: TbxMatSeverityLevelType;

    /** Message text displayed in the snackbar body. */
    readonly message: string;

    /**
     * Display duration in milliseconds.
     *
     * Automatically clamped to the range
     * [`NOTIFICATION_MIN_DURATION_MS`..`NOTIFICATION_MAX_DURATION_MS`]
     * (1000–6000ms). Values below the minimum are raised; values above
     * the maximum are lowered. When omitted, defaults to
     * `NOTIFICATION_DEFAULT_DURATION_MS` (4000ms).
     */
    readonly duration?: number;

    /**
     * Horizontal position of the snackbar within the viewport.
     *
     * Maps directly to Angular Material's `MatSnackBarHorizontalPosition`.
     * Common values: `'start'` (left in LTR), `'center'`, `'end'` (right in LTR).
     * Defaults to `'start'`.
     */
    readonly horizontalPosition?: MatSnackBarHorizontalPosition;

    /**
     * Vertical position of the snackbar within the viewport.
     *
     * Maps directly to Angular Material's `MatSnackBarVerticalPosition`.
     * Values: `'top'` or `'bottom'`. Defaults to `'bottom'`.
     */
    readonly verticalPosition?: MatSnackBarVerticalPosition;

    /**
     * Show a countdown progress bar along the bottom edge of the snackbar.
     *
     * The bar shrinks from full width to zero over the notification's
     * resolved duration, giving users a visual indication of how long the
     * notification will remain visible. The animation is pure CSS (the
     * duration is set via `animation-duration` style binding) — no
     * JavaScript timers are involved.
     *
     * Defaults to `false`.
     */
    readonly showCountdown?: boolean;

    /**
     * Show the severity icon in the snackbar.
     *
     * When `true` (the default), the severity-level icon is rendered to the
     * left of the message text. Set to `false` to hide the icon and display
     * only the message.
     *
     * Defaults to `true`.
     */
    readonly showSeverityIcon?: boolean;

    /**
     * Show the close/dismiss button in the snackbar.
     *
     * When `true` (the default), a dismiss button is rendered on the
     * trailing edge of the notification. Set to `false` to hide the button
     * so the notification can only be dismissed by the duration timeout or
     * programmatically via `dismiss()` / `dismissAll()`.
     *
     * Defaults to `true`.
     */
    readonly showCloseButton?: boolean;
}
