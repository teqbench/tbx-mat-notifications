import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';

import { type TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';
import { type TbxMatNotificationActionButtonAppearance } from '../types/notification-action-button-appearance.type';

/**
 * Configuration for a notification action button
 *
 * @remarks
 * Defines the content and appearance of the optional action button rendered
 * in the notification snackbar. The action button sits between the message
 * and the close button in the
 * {@link https://m3.material.io/components/snackbar/specs | M3 snackbar anatomy}.
 *
 * ### Resolution Cascade
 *
 * Properties set here override the corresponding property on
 * {@link TbxMatNotificationProviderActionConfig}. When neither is set,
 * the following defaults apply:
 *
 * - `actionButtonType` — `'text'`
 * - `iconPosition` — `TbxMatNotificationIconPosition.Before`
 * - `actionIconResolverService` — none (required when `iconName` is set
 *   and the resolved button type uses icons)
 *
 * ### Fallback Rules
 *
 * The service applies fallback rules when the provided combination of
 * fields is invalid:
 *
 * - `actionButtonType` is `'icon'` but `iconName` is not set — falls back
 *   to `'text'` and renders the label as a text button.
 * - `actionButtonType` is `'text'` and `iconName` is set — the icon is
 *   ignored; only the label is rendered.
 * - `iconName` is set and the resolved button type requires an icon, but
 *   no `actionIconResolverService` is available (neither per-notification
 *   nor provider-level) — logs an error and does not render the action.
 *
 * @usage
 * Add an action to a notification to let users respond inline (e.g., undo,
 * retry, view). Set on {@link TbxMatNotificationConfig.action} or passed
 * via the convenience method config args.
 *
 * @example Text action button:
 * ```typescript
 * this.notificationService.success('Item deleted', {
 *     action: { label: 'Undo' },
 *     duration: 30_000,
 * });
 * ```
 *
 * @example Icon-only action button:
 * ```typescript
 * // label serves as the aria-label for accessibility
 * this.notificationService.error('Upload failed', {
 *     action: {
 *         label: 'Retry',
 *         iconName: 'refresh',
 *         actionButtonType: 'icon',
 *         actionIconResolverService: myIconService,
 *     },
 * });
 * ```
 *
 * @example Tonal button with icon:
 * ```typescript
 * this.notificationService.warning('Connection lost', {
 *     action: {
 *         label: 'Retry',
 *         iconName: 'sync',
 *         actionButtonType: 'tonal',
 *         iconPosition: TbxMatNotificationIconPosition.Before,
 *         actionIconResolverService: myIconService,
 *     },
 * });
 * ```
 *
 * @category Models
 * @displayName Notification Action
 * @order 4
 * @since 6.0.0
 * @related TbxMatNotificationProviderActionConfig
 * @related TbxMatNotificationActionButtonAppearance
 * @related TbxMatNotificationIconPosition
 * @related TbxMatNotificationConfig
 *
 * @public
 */
export interface TbxMatNotificationAction {
    /**
     * Action button label text
     *
     * @remarks
     * Always required. Displayed as the button text when `actionButtonType`
     * is `'text'` or any {@link https://material.angular.dev/components/button/api | MatButtonAppearance}
     * value. Used as the `aria-label` when `actionButtonType` is `'icon'`.
     *
     * @public
     */
    readonly label: string;

    /**
     * Icon name to resolve via the action icon resolver service
     *
     * @remarks
     * The resolved icon renders inside the action button. Required when
     * `actionButtonType` is `'icon'`. Optional when `actionButtonType` is
     * a {@link https://material.angular.dev/components/button/api | MatButtonAppearance}
     * value. Ignored when `actionButtonType` is `'text'`.
     *
     * The name is passed to the `resolve()` method of the
     * `actionIconResolverService`. For font icons, this is typically the
     * {@link https://fonts.google.com/icons | Material Symbols} ligature name.
     *
     * @public
     */
    readonly iconName?: string;

    /**
     * Visual appearance of the action button
     *
     * @remarks
     * Overrides the provider-level
     * {@link TbxMatNotificationProviderActionConfig.actionButtonType}.
     * When neither is set, defaults to `'text'`.
     *
     * @public
     */
    readonly actionButtonType?: TbxMatNotificationActionButtonAppearance;

    /**
     * Position of the icon relative to the label text
     *
     * @remarks
     * Overrides the provider-level
     * {@link TbxMatNotificationProviderActionConfig.iconPosition}.
     * When neither is set, defaults to `TbxMatNotificationIconPosition.Before`.
     * Has no effect when `actionButtonType` is `'icon'` (icon-only buttons
     * have no label to position relative to).
     *
     * @public
     */
    readonly iconPosition?: TbxMatNotificationIconPosition;

    /**
     * Icon resolver service for action button icons
     *
     * @remarks
     * Overrides the provider-level
     * {@link TbxMatNotificationProviderActionConfig.actionIconResolverService}.
     * Required when `iconName` is set and the resolved button type renders
     * an icon. If neither per-notification nor provider-level resolver is
     * available, the service logs an error and does not render the action.
     *
     * @public
     */
    readonly actionIconResolverService?: TbxMatIconResolver<string> & {
        readonly iconType: TbxMatIconType;
    };
}
