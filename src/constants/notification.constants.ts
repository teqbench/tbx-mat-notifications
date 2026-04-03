import type {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

/**
 * Notification system constants.
 *
 * Centralizes timing and positioning defaults for snackbar notifications.
 * These values are used internally by {@link TbxMatNotificationService}
 * and are not exported from the public API. Consumers override per-call
 * via {@link TbxMatNotificationConfig.duration},
 * {@link TbxMatNotificationConfig.horizontalPosition}, and
 * {@link TbxMatNotificationConfig.verticalPosition}.
 */

/**
 * Minimum duration a notification is displayed (milliseconds).
 *
 * Prevents notifications from disappearing too quickly to be read.
 * Any duration below this value is clamped up to this minimum.
 */
export const NOTIFICATION_MIN_DURATION_MS = 1_000;

/**
 * Maximum duration a notification is displayed (milliseconds).
 *
 * Prevents notifications from blocking the UI for too long.
 * Any duration above this value is clamped down to this maximum.
 */
export const NOTIFICATION_MAX_DURATION_MS = 6_000;

/**
 * Default duration when no duration is specified (milliseconds).
 *
 * Used when {@link TbxMatNotificationConfig.duration} is omitted.
 * Balances readability with minimal disruption.
 */
export const NOTIFICATION_DEFAULT_DURATION_MS = 4_000;

/**
 * Default horizontal position for snackbar notifications.
 *
 * Aligns with {@link https://m3.material.io/components/snackbar | Material Design} guidance for snackbar placement.
 * `'start'` maps to the left edge in LTR layouts, right in RTL.
 */
export const NOTIFICATION_DEFAULT_HORIZONTAL_POSITION: MatSnackBarHorizontalPosition = 'start';

/**
 * Default vertical position for snackbar notifications.
 *
 * Bottom placement follows {@link https://m3.material.io/components/snackbar | Material Design} guidelines — snackbars
 * appear at the bottom of the viewport to avoid interfering with
 * primary content and navigation.
 */
export const NOTIFICATION_DEFAULT_VERTICAL_POSITION: MatSnackBarVerticalPosition = 'bottom';
