/**
 * Notification system — typed snackbar notifications with severity levels.
 *
 * Public API:
 *   - TbxMatNotificationService          — inject and call success/error/warn/info/help
 *   - TbxMatSeverityLevelType               — severity enum (re-exported from @teqbench/tbx-mat-severity-icons)
 *   - TbxMatNotificationConfig           — full config interface for show()
 *   - TbxMatNotificationConfigArgsType   — optional config for convenience methods
 *   - TbxMatNotificationProviderConfig   — icon provider config interface
 *   - TBX_MAT_NOTIFICATION_PROVIDER_CONFIG — injection token for icon configuration
 *   - TbxMatNotificationFontIconService  — default font-based severity icon service
 *   - TbxMatNotificationSvgIconService   — default SVG-based severity icon service
 *
 * Internal (not re-exported):
 *   - NotificationComponent — custom snackbar content
 *   - NotificationData      — MAT_SNACK_BAR_DATA payload
 *   - Constants             — duration min/max/default
 */

// Types (re-exported from @teqbench/tbx-mat-severity-icons)
export { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
export type { TbxMatNotificationConfigArgsType } from './types/notification-config-args.type';

// Models
export type { TbxMatNotificationConfig } from './models/notification-config.model';
export type { TbxMatNotificationProviderConfig } from './models/notification-provider-config.model';

// Tokens
export { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from './tokens/notification-provider-config.token';

// Services
export { TbxMatNotificationService } from './services/notification.service';
export { TbxMatNotificationFontIconService } from './services/notification-font-icon.service';
export { TbxMatNotificationSvgIconService } from './services/notification-svg-icon.service';
