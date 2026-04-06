import type { MatButtonAppearance } from '@angular/material/button';

/**
 * Visual appearance of a notification action button
 *
 * @remarks
 * Union of {@link https://material.angular.dev/components/button/api | MatButtonAppearance}
 * (`'text'` | `'filled'` | `'elevated'` | `'outlined'` | `'tonal'`) and the
 * custom `'icon'` value for icon-only action buttons.
 *
 * Values other than `'icon'` map directly to the `[appearance]` input on
 * {@link https://material.angular.dev/components/button/api | Angular Material} button
 * directives. The `'icon'` value renders a `mat-icon-button` instead.
 *
 * This type is coupled to `MatButtonAppearance` from `@angular/material/button`.
 * If {@link https://material.angular.dev | Angular Material} renames, removes,
 * or adds values to that type, this type will need a corresponding update.
 *
 * The appearance can be set at the provider level via
 * {@link TbxMatNotificationProviderActionConfig.actionButtonType} or
 * per-notification via {@link TbxMatNotificationAction.actionButtonType}.
 * Per-notification takes precedence. When neither is set, defaults to `'text'`
 * per {@link https://m3.material.io/components/snackbar/guidelines | M3 guidelines}
 * (snackbars are the lowest-priority notification surface).
 *
 * @usage
 * Specify the action button appearance when the default `'text'` style
 * is not desired.
 *
 * @example
 * ```typescript
 * // Tonal action button
 * this.notificationService.warning('Connection lost', {
 *     action: {
 *         label: 'Retry',
 *         actionButtonType: 'tonal',
 *     },
 * });
 *
 * // Icon-only action button
 * this.notificationService.error('Upload failed', {
 *     action: {
 *         label: 'Retry', // used as aria-label
 *         iconName: 'refresh',
 *         actionButtonType: 'icon',
 *     },
 * });
 * ```
 *
 * @category Types
 * @displayName Notification Action Button Appearance
 * @order 1
 * @since 6.0.0
 * @related TbxMatNotificationAction
 * @related TbxMatNotificationProviderActionConfig
 *
 * @public
 */
export type TbxMatNotificationActionButtonAppearance = MatButtonAppearance | 'icon';
