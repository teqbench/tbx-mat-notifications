/**
 * Notification system — typed snackbar notifications with severity levels.
 *
 * Public API:
 *   - TbxMatNotificationService     — inject and call success/error/warn/info/help
 *   - TbxMatSeverityLevelType       — severity enum (re-exported from @teqbench/tbx-mat-severity-icons)
 *   - TbxMatNotificationConfig      — full config interface for show()
 *   - TbxMatNotificationConfigArgsType — optional config for convenience methods
 *   - TBX_MAT_NOTIFICATION_ICON_SERVICE — optional injection token for custom icon service
 *   - TbxMatNotificationIconService — default icon implementation (Material Symbols Rounded)
 *
 * Internal (not re-exported):
 *   - NotificationComponent — custom snackbar content
 *   - NotificationData      — MAT_SNACK_BAR_DATA payload
 *   - Constants                     — duration min/max/default
 */

// Types (re-exported from @teqbench/tbx-mat-severity-icons)
export { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
export type { TbxMatNotificationConfigArgsType } from './types/notification-config-args.type';

// Models
export type { TbxMatNotificationConfig } from './models/notification-config.model';

// Tokens
export { TBX_MAT_NOTIFICATION_ICON_SERVICE } from './tokens/notification-icon-service.token';

// Services
export { TbxMatNotificationService } from './services/notification.service';
export { TbxMatNotificationIconService } from './services/notification-icon.service';
