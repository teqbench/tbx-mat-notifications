/**
 * Typed snackbar notifications with severity levels for Angular
 *
 * @remarks
 * An opinionated thin layer around
 * {@link https://material.angular.dev/components/snack-bar/api | Angular Material's MatSnackBar}
 * with severity-leveled methods, FIFO queuing with signal-based state, configurable
 * duration, optional action button, optional severity icon and close button
 * visibility, a pure-CSS countdown bar, and native
 * {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarRef}
 * exposure via {@link TbxMatNotificationRef}.
 *
 * Key exports:
 *
 * - {@link TbxMatNotificationService} — inject and call success/error/warning/information/help.
 * - {@link TbxMatNotificationRef} — returned from all service methods with config, native ref, and result promises.
 * - {@link TbxMatNotificationResult} — dismiss result with {@link TbxMatNotificationDismissReason}.
 * - {@link TbxMatNotificationDismissReason} — enum of dismiss reasons (Action, Close, Timeout, etc.).
 * - {@link TbxMatNotificationIconPosition} — enum for action button icon position (Before, After).
 * - {@link TbxMatNotificationConfig} — full config interface for show().
 * - {@link TbxMatNotificationConfigArgs} — optional config for convenience methods.
 * - {@link TbxMatNotificationAction} — action button configuration.
 * - {@link TbxMatNotificationProviderConfig} — icon provider config interface.
 * - {@link TbxMatNotificationProviderActionConfig} — provider-level action defaults.
 * - {@link TBX_MAT_NOTIFICATION_PROVIDER_CONFIG} — injection token for provider configuration.
 * - {@link TbxMatNotificationSeverityFontIconService} — default font-based severity icon service.
 * - {@link TbxMatNotificationSeveritySvgIconService} — default SVG-based severity icon service.
 * - {@link TbxMatNotificationCloseFontIconService} — default font-based close icon service.
 * - {@link TbxMatNotificationComponent} — snackbar content component (exported for typing).
 *
 * @see {@link https://angular.dev | Angular}
 * @see {@link https://material.angular.dev | Angular Material}
 *
 * @packageDocumentation
 */

// Enums
export { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
export { TbxMatNotificationDismissReason } from './enums/notification-dismiss-reason.enum';
export { TbxMatNotificationIconPosition } from './enums/notification-icon-position.enum';

// Types
export type { TbxMatNotificationConfigArgs } from './types/notification-config-args.type';
export type { TbxMatNotificationActionButtonAppearance } from './types/notification-action-button-appearance.type';

// Models
export type { TbxMatNotificationConfig } from './models/notification-config.model';
export type { TbxMatNotificationProviderConfig } from './models/notification-provider-config.model';
export type { TbxMatNotificationProviderActionConfig } from './models/notification-provider-action-config.model';
export type { TbxMatNotificationAction } from './models/notification-action.model';
export type { TbxMatNotificationRef } from './models/notification-ref.model';
export type { TbxMatNotificationResult } from './models/notification-result.model';

// Tokens
export { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from './tokens/notification-provider-config.token';

// Components
export { TbxMatNotificationComponent } from './components/notification.component';

// Services
export { TbxMatNotificationService } from './services/notification.service';
export { TbxMatNotificationSeverityFontIconService } from './services/notification-severity-font-icon.service';
export { TbxMatNotificationSeveritySvgIconService } from './services/notification-severity-svg-icon.service';
export { TbxMatNotificationCloseFontIconService } from './services/notification-close-font-icon.service';
