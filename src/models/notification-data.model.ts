import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';

/**
 * Internal data payload injected into the internal `NotificationComponent` via
 * `MAT_SNACK_BAR_DATA`.
 *
 * Not part of the public API — consumers use
 * {@link TbxMatNotificationService}, not this interface directly.
 * The service constructs this payload from {@link TbxMatNotificationConfig}
 * and passes it to the component when opening the snackbar.
 */
export interface NotificationData {
    /** Severity level — used to resolve the icon and apply the panel class. */
    readonly type: TbxMatSeverityLevel;

    /** Message text displayed in the snackbar body. */
    readonly message: string;

    /**
     * Callback to dismiss the current notification.
     * Bound to the close button's `(click)` handler in the component template
     * when `showCloseButton` is `true`.
     */
    readonly dismiss: () => void;

    /**
     * Resolved duration in milliseconds (after clamping to min/max range).
     * Used as the CSS `animation-duration` for the countdown bar.
     */
    readonly duration: number;

    /** Whether to render the countdown progress bar. */
    readonly showCountdown: boolean;

    /** Whether to render the severity icon. */
    readonly showSeverityIcon: boolean;

    /** Whether to render the close/dismiss button. */
    readonly showCloseButton: boolean;
}
