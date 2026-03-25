import { SeverityLevelType } from '@teqbench/tbx-mat-severity-icons';

/**
 * Internal data payload injected into NotificationComponent via
 * MAT_SNACK_BAR_DATA. Not part of the public API — consumers use
 * NotificationService, not this interface directly.
 */
export interface NotificationData {
    readonly type: SeverityLevelType;
    readonly message: string;
    readonly dismiss: () => void;

    /** Resolved duration in milliseconds (after clamping). Used by the countdown animation. */
    readonly duration: number;

    /** Whether to render the countdown progress bar. */
    readonly showCountdown: boolean;
}
