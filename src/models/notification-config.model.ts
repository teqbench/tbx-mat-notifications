import type { MatSnackBarConfig } from '@angular/material/snack-bar';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';

import { type TbxMatNotificationAction } from './notification-action.model';

/**
 * Configuration for a single notification
 *
 * @remarks
 * Passed to {@link TbxMatNotificationService.show} for full control over
 * severity level, message, duration, action button, countdown behavior,
 * icon visibility, and close button visibility.
 * The convenience methods (`success()`, `error()`, `warning()`, `information()`,
 * `help()`) set `type` automatically — use this interface directly when
 * you need to specify all options.
 *
 * Native {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarConfig}
 * properties (position, politeness, direction, etc.) are available via the
 * `snackBarConfig` passthrough. The `panelClass` property on the passthrough
 * is merged with the severity-level panel class — consumer-provided classes
 * are appended, not replaced.
 *
 * @example Full control via show():
 * ```typescript
 * import { TbxMatNotificationService, TbxMatSeverityLevel } from '@teqbench/tbx-mat-notifications';
 *
 * private readonly notify = inject(TbxMatNotificationService);
 *
 * this.notify.show({
 *     type: TbxMatSeverityLevel.Warning,
 *     message: 'Unsaved changes will be lost.',
 *     duration: 30_000,
 *     showCountdown: true,
 *     action: { label: 'Discard' },
 *     snackBarConfig: {
 *         horizontalPosition: 'center',
 *         verticalPosition: 'top',
 *     },
 * });
 * ```
 *
 * @example Using convenience methods with optional overrides:
 * ```typescript
 * // Type is set automatically; override duration and add action:
 * this.notify.success('Item deleted.', {
 *     duration: 30_000,
 *     action: { label: 'Undo' },
 * });
 *
 * // Hide the severity icon:
 * this.notify.warning('Low disk space.', { showSeverityIcon: false });
 *
 * // Auto-dismiss only (no close button):
 * this.notify.information('Syncing...', { showCloseButton: false, showCountdown: true });
 * ```
 *
 * @category Models
 * @since 1.0.0
 * @related TbxMatNotificationConfigArgs
 * @related TbxMatNotificationService
 * @related TbxMatNotificationAction
 * @related TbxMatNotificationRef
 *
 * @public
 */
export interface TbxMatNotificationConfig {
    /**
     * Severity level — determines the icon, panel color, and CSS class applied to the snackbar
     *
     * @public
     */
    readonly type: TbxMatSeverityLevel;

    /**
     * Message text displayed in the snackbar body
     *
     * @public
     */
    readonly message: string;

    /**
     * Display duration in milliseconds
     *
     * @remarks
     * - `<= 0` — indefinite (no auto-dismiss). The notification remains visible
     *   until dismissed by the action button, close button, or programmatic
     *   `dismiss()` / `dismissAll()`. Setting `duration <= 0` with
     *   `showCloseButton: false` and no `action` creates an undismissable
     *   notification — only programmatic dismissal will close it.
     * - `> 0` — used as-is, no clamping applied.
     * - Not set — defaults to `NOTIFICATION_DEFAULT_DURATION_MS` (10000ms).
     *
     * For notifications with an action button, a longer duration is recommended
     * (e.g., 30000ms) to give users time to read and respond.
     *
     * @public
     */
    readonly duration?: number;

    /**
     * Show a countdown progress bar along the bottom edge of the snackbar
     *
     * @remarks
     * The bar shrinks from full width to zero over the notification's
     * resolved duration, giving users a visual indication of how long the
     * notification will remain visible. The animation is pure CSS (the
     * duration is set via `animation-duration` style binding) — no
     * JavaScript timers are involved.
     *
     * The countdown bar only renders when this is `true` AND the duration
     * is not indefinite (`duration > 0`). Setting `showCountdown: true`
     * with `duration <= 0` has no visible effect.
     *
     * Defaults to `false`.
     *
     * @public
     */
    readonly showCountdown?: boolean;

    /**
     * Show the severity icon in the snackbar
     *
     * @remarks
     * When `true` (the default), the severity-level icon is rendered to the
     * left of the message text. Set to `false` to hide the icon and display
     * only the message.
     *
     * Defaults to `true`.
     *
     * @public
     */
    readonly showSeverityIcon?: boolean;

    /**
     * Show the close/dismiss button in the snackbar
     *
     * @remarks
     * When `true` (the default), a dismiss button is rendered on the
     * trailing edge of the notification. Set to `false` to hide the button
     * so the notification can only be dismissed by the action button,
     * duration timeout, or programmatically via `dismiss()` / `dismissAll()`.
     *
     * Defaults to `true`.
     *
     * @public
     */
    readonly showCloseButton?: boolean;

    /**
     * Optional action button configuration
     *
     * @remarks
     * Renders a single action button between the message and the close button,
     * per the {@link https://m3.material.io/components/snackbar/specs | M3 snackbar anatomy}.
     * When the action is clicked, the notification is dismissed and the
     * {@link TbxMatNotificationRef.result} promise resolves with
     * {@link TbxMatNotificationDismissReason.Action}.
     *
     * @public
     */
    readonly action?: TbxMatNotificationAction;

    /**
     * Native snackbar configuration passthrough
     *
     * @remarks
     * Passes through properties to the underlying
     * {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarConfig}.
     * Use this for properties the notification package does not wrap
     * with its own API (e.g., `horizontalPosition`, `verticalPosition`,
     * `politeness`, `announcementMessage`, `direction`, `viewContainerRef`).
     *
     * `data` is excluded because it is used internally to pass the
     * {@link NotificationDataDto} to the component. `duration` is excluded
     * because the notification package applies its own duration logic
     * (indefinite, default).
     *
     * `panelClass` values are merged with the severity-level panel class —
     * consumer-provided classes are appended, not replaced.
     *
     * @public
     */
    readonly snackBarConfig?: Partial<Omit<MatSnackBarConfig, 'data' | 'duration'>>;
}
