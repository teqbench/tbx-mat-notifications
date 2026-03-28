import { type TbxMatNotificationConfig } from '../models/notification-config.model';

/**
 * Optional configuration overrides for the convenience notification methods
 * (`success()`, `error()`, `warning()`, `information()`, `help()`).
 *
 * Derived from {@link TbxMatNotificationConfig} with `type` and `message`
 * omitted — those are set automatically by the convenience method and its
 * `message` argument respectively.
 *
 * @example Override duration and enable countdown:
 * ```typescript
 * this.notify.success('Item saved.', {
 *     duration: 2000,
 *     showCountdown: true,
 * });
 * ```
 *
 * @example Override position:
 * ```typescript
 * this.notify.error('Upload failed.', {
 *     horizontalPosition: 'center',
 *     verticalPosition: 'top',
 * });
 * ```
 */
export type TbxMatNotificationConfigArgsType = Omit<TbxMatNotificationConfig, 'type' | 'message'>;
