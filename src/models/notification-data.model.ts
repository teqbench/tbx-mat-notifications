import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';

/**
 * Internal data payload injected into {@link NotificationComponent} via
 * `MAT_SNACK_BAR_DATA`.
 *
 * Not part of the public API — consumers use
 * {@link TbxMatNotificationService}, not this interface directly.
 * The service constructs this payload from {@link TbxMatNotificationConfig}
 * and passes it to the component when opening the snackbar.
 */
export interface NotificationData {
    /** Severity level — used to resolve the icon and apply the panel class. */
    readonly type: TbxMatSeverityLevelType;

    /** Message text displayed in the snackbar body. */
    readonly message: string;

    /**
     * Callback to dismiss the current notification.
     * Bound to the close button's `(click)` handler in the component template.
     */
    readonly dismiss: () => void;

    /**
     * Resolved duration in milliseconds (after clamping to min/max range).
     * Used as the CSS `animation-duration` for the countdown bar.
     */
    readonly duration: number;

    /** Whether to render the countdown progress bar. */
    readonly showCountdown: boolean;
}
