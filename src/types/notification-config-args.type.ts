import { type TbxMatNotificationConfig } from '../models/notification-config.model';

/**
 * Optional configuration overrides for the convenience notification methods
 *
 * @remarks
 * Derived from {@link TbxMatNotificationConfig} with `type` and `message`
 * omitted — those are set automatically by the convenience method and its
 * `message` argument respectively.
 *
 * The convenience methods on {@link TbxMatNotificationService} (`success()`,
 * `error()`, `warning()`, `information()`, `help()`) accept this type as an
 * optional second argument to override duration, position, countdown, and
 * visibility options.
 *
 * @example Override duration and enable countdown:
 * ```typescript
 * this.notify.success('Item saved.', {
 *     duration: 2000,
 *     showCountdown: true,
 * });
 * ```
 *
 * @example Override position via snackBarConfig passthrough:
 * ```typescript
 * this.notify.error('Upload failed.', {
 *     snackBarConfig: {
 *         horizontalPosition: 'center',
 *         verticalPosition: 'top',
 *     },
 * });
 * ```
 *
 * @category Types
 * @since 1.0.0
 * @related TbxMatNotificationConfig
 * @related TbxMatNotificationService
 *
 * @public
 */
export type TbxMatNotificationConfigArgs = Omit<TbxMatNotificationConfig, 'type' | 'message'>;
