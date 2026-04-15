import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { type TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

import { type TbxMatNotificationActionButtonAppearance } from '../types/notification-action-button-appearance.type';
import { type TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';

/**
 * Internal DTO injected into {@link TbxMatNotificationComponent} via `MAT_SNACK_BAR_DATA`
 *
 * @remarks
 * Not part of the public API — consumers use
 * {@link TbxMatNotificationService}, not this interface directly.
 * The service constructs this DTO from {@link TbxMatNotificationConfig},
 * applying resolution cascades and defaults, then passes it to the
 * component via `MatSnackBarConfig.data`.
 *
 * @internal
 */
export interface NotificationDataDto {
    /** Severity level — used to resolve the icon and apply the panel class. */
    readonly type: TbxMatSeverityLevel;

    /** Message text displayed in the snackbar body. */
    readonly message: string;

    /**
     * Callback to dismiss the notification via the close button.
     * Sets the close flag internally, then calls `MatSnackBarRef.dismiss()`.
     */
    readonly dismissByClose: () => void;

    /**
     * Callback to dismiss the notification via the action button.
     * Calls `MatSnackBarRef.dismissWithAction()` so
     * `MatSnackBarDismiss.dismissedByAction` is `true`.
     */
    readonly dismissByAction: () => void;

    /**
     * Resolved duration in milliseconds.
     * `0` indicates indefinite (no auto-dismiss).
     * Used as the CSS `animation-duration` for the countdown bar.
     */
    readonly duration: number;

    /** Whether to render the countdown progress bar. */
    readonly showCountdown: boolean;

    /** Whether to render the severity icon. */
    readonly showSeverityIcon: boolean;

    /** Whether to render the close/dismiss button. */
    readonly showCloseButton: boolean;

    /** Close button icon resolver — resolves the close icon name and determines font vs SVG. */
    readonly closeIconResolverService: TbxMatIconResolver<string> & {
        readonly iconType: TbxMatIconType;
    };

    /** Action button label. Present when an action is configured. */
    readonly actionLabel?: string;

    /** Resolved action button appearance. Present when an action is configured. */
    readonly actionButtonType?: TbxMatNotificationActionButtonAppearance;

    /** Action button icon name. Present when an action with icon is configured. */
    readonly actionIconName?: string;

    /** Action button icon position relative to label. Present when an action with icon is configured. */
    readonly actionIconPosition?: TbxMatNotificationIconPosition;

    /** Action icon resolver — resolves the action icon name and determines font vs SVG. */
    readonly actionIconResolverService?: TbxMatIconResolver<string> & {
        readonly iconType: TbxMatIconType;
    };
}
