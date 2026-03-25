import type {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SeverityLevelType } from '@teqbench/tbx-mat-severity-icons';

/**
 * Configuration for a single notification. Passed to NotificationService.show()
 * for full control, or use the convenience methods (success, error, warn, etc.)
 * which set the type automatically.
 */
export interface NotificationConfig {
    /** Severity level — determines icon, color, and panel styling. */
    readonly type: SeverityLevelType;

    /** Message text displayed in the snackbar body. */
    readonly message: string;

    /**
     * Display duration in milliseconds.
     * Clamped to NOTIFICATION_MIN_DURATION_MS..NOTIFICATION_MAX_DURATION_MS.
     * Defaults to NOTIFICATION_DEFAULT_DURATION_MS when omitted.
     */
    readonly duration?: number;

    /** Horizontal position. Defaults to 'start'. */
    readonly horizontalPosition?: MatSnackBarHorizontalPosition;

    /** Vertical position. Defaults to 'bottom'. */
    readonly verticalPosition?: MatSnackBarVerticalPosition;

    /**
     * Show a countdown progress bar along the bottom edge of the snackbar.
     * The bar shrinks from full width to zero over the notification's duration,
     * giving users a visual indication of how long the notification will remain.
     * Uses a pure CSS animation — no JavaScript timers.
     * Defaults to false.
     */
    readonly showCountdown?: boolean;
}
