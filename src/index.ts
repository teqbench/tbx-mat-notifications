/**
 * Notification system — typed snackbar notifications with severity levels.
 *
 * Public API:
 *   - NotificationService     — inject and call success/error/warn/info/help
 *   - SeverityLevelType       — severity enum (re-exported from @teqbench/tbx-mat-severity-icons)
 *   - NotificationConfig      — full config interface for show()
 *   - NotificationConfigArgsType — optional config for convenience methods
 *   - NOTIFICATION_ICON_SERVICE — optional injection token for custom icon service
 *   - NotificationIconService — default icon implementation (Material Symbols Rounded)
 *
 * Internal (not re-exported):
 *   - NotificationComponent — custom snackbar content
 *   - NotificationData      — MAT_SNACK_BAR_DATA payload
 *   - Constants                     — duration min/max/default
 */

// Types (re-exported from @teqbench/tbx-mat-severity-icons)
export { SeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
export type { NotificationConfigArgsType } from './types/notification-config-args.type';

// Models
export type { NotificationConfig } from './models/notification-config.model';

// Tokens
export { NOTIFICATION_ICON_SERVICE } from './tokens/notification-icon-service.token';

// Services
export { NotificationService } from './services/notification.service';
export { NotificationIconService } from './services/notification-icon.service';
