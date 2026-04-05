import { TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';
import type { TbxMatNotificationActionButtonAppearance } from '../types/notification-action-button-appearance.type';

/**
 * Notification system constants.
 *
 * Centralizes timing and action defaults for snackbar notifications.
 * These values are used internally by {@link TbxMatNotificationService}
 * and are not exported from the public API. Consumers override per-call
 * via {@link TbxMatNotificationConfig}.
 */

/**
 * Default duration when no duration is specified (milliseconds).
 *
 * Used when {@link TbxMatNotificationConfig.duration} is omitted.
 * For notifications with an action button, a longer duration is
 * recommended (e.g., 30000ms) to give users time to respond.
 */
export const NOTIFICATION_DEFAULT_DURATION_MS = 10_000;

/**
 * Default action button appearance when not specified at the
 * provider level or per-notification.
 *
 * Per {@link https://m3.material.io/components/snackbar/guidelines | M3 guidelines},
 * snackbars are the lowest-priority notification surface, so `'text'`
 * (lowest emphasis) is the appropriate default.
 */
export const NOTIFICATION_DEFAULT_ACTION_BUTTON_TYPE: TbxMatNotificationActionButtonAppearance = 'text';

/**
 * Default icon position relative to the action button label when
 * not specified at the provider level or per-notification.
 */
export const NOTIFICATION_DEFAULT_ICON_POSITION: TbxMatNotificationIconPosition = TbxMatNotificationIconPosition.Before;
