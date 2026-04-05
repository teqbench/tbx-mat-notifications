/**
 * Typed snackbar notifications with severity levels for Angular
 *
 * @remarks
 * Wraps {@link https://material.angular.io/components/snack-bar | Angular Material's MatSnackBar}
 * with severity-leveled methods, FIFO queuing with signal-based state, configurable
 * duration/position, optional severity icon and close button visibility, and a pure-CSS
 * countdown bar — no JS timers. Supports both font and SVG icons via
 * {@link TBX_MAT_NOTIFICATION_PROVIDER_CONFIG}.
 *
 * Key exports:
 *
 * - {@link TbxMatNotificationService} — inject and call success/error/warning/information/help.
 * - {@link TbxMatNotificationConfig} — full config interface for show().
 * - {@link TbxMatNotificationConfigArgs} — optional config for convenience methods.
 * - {@link TbxMatNotificationProviderConfig} — icon provider config interface.
 * - {@link TBX_MAT_NOTIFICATION_PROVIDER_CONFIG} — injection token for icon configuration.
 * - {@link TbxMatNotificationSeverityFontIconService} — default font-based severity icon service.
 * - {@link TbxMatNotificationSeveritySvgIconService} — default SVG-based severity icon service.
 *
 * @see {@link https://angular.dev | Angular}
 * @see {@link https://material.angular.io | Angular Material}
 *
 * @packageDocumentation
 */

// Enums (re-exported from @teqbench/tbx-mat-severity-icons)
export { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';

// Types (re-exported from @teqbench/tbx-mat-severity-icons)
export type { TbxMatNotificationConfigArgs } from './types/notification-config-args.type';

// Models
export type { TbxMatNotificationConfig } from './models/notification-config.model';
export type { TbxMatNotificationProviderConfig } from './models/notification-provider-config.model';

// Tokens
export { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from './tokens/notification-provider-config.token';

// Services
export { TbxMatNotificationService } from './services/notification.service';
export { TbxMatNotificationSeverityFontIconService } from './services/notification-severity-font-icon.service';
export { TbxMatNotificationSeveritySvgIconService } from './services/notification-severity-svg-icon.service';
