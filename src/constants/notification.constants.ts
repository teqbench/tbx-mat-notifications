import type {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

/**
 * Notification system constants.
 *
 * Centralizes timing defaults for snackbar notifications. Override per-call
 * via TbxMatNotificationConfig.duration when the default is inappropriate.
 */

/** Minimum duration a notification is displayed (milliseconds). */
export const NOTIFICATION_MIN_DURATION_MS = 1_000;

/** Maximum duration a notification is displayed (milliseconds). */
export const NOTIFICATION_MAX_DURATION_MS = 6_000;

/** Default duration when no duration is specified (milliseconds). */
export const NOTIFICATION_DEFAULT_DURATION_MS = 4_000;

/** Default horizontal position for snackbar notifications. */
export const NOTIFICATION_DEFAULT_HORIZONTAL_POSITION: MatSnackBarHorizontalPosition = 'start';

/** Default vertical position for snackbar notifications. */
export const NOTIFICATION_DEFAULT_VERTICAL_POSITION: MatSnackBarVerticalPosition = 'bottom';
