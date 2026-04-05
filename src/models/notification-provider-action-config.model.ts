import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';

import { type TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';
import { type TbxMatNotificationActionButtonAppearance } from '../types/notification-action-button-appearance.type';

/**
 * Provider-level defaults for notification action buttons
 *
 * @remarks
 * Set on {@link TbxMatNotificationProviderConfig.actionConfig} to establish
 * application-wide defaults for action button appearance, icon position,
 * and icon resolution. Individual notifications can override any of these
 * via {@link TbxMatNotificationAction}.
 *
 * All properties are optional. When a property is not set here and not
 * overridden per-notification, the following defaults apply:
 *
 * - `actionButtonType` — `'text'`
 * - `iconPosition` — `TbxMatNotificationIconPosition.Before`
 * - `actionIconResolverService` — none
 *
 * @usage
 * Configure action button defaults in the provider config when all or most
 * action buttons in the application share the same appearance or icon
 * resolver. Omit entirely if action buttons are not used or defaults are
 * sufficient.
 *
 * @example Provider config with tonal action defaults:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationSeverityFontIconService('material-symbols-rounded'),
 *             actionConfig: {
 *                 actionButtonType: 'tonal',
 *                 iconPosition: TbxMatNotificationIconPosition.Before,
 *                 actionIconResolverService: new MyActionIconService(),
 *             },
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Models
 * @displayName Provider Action Config
 * @order 5
 * @since 6.0.0
 * @related TbxMatNotificationAction
 * @related TbxMatNotificationProviderConfig
 * @related TbxMatNotificationActionButtonAppearance
 * @related TbxMatNotificationIconPosition
 *
 * @public
 */
export interface TbxMatNotificationProviderActionConfig {
    /**
     * Default visual appearance for action buttons application-wide
     *
     * @remarks
     * Per-notification {@link TbxMatNotificationAction.actionButtonType}
     * overrides this value. When neither is set, defaults to `'text'`.
     *
     * @public
     */
    readonly actionButtonType?: TbxMatNotificationActionButtonAppearance;

    /**
     * Default icon position for action buttons application-wide
     *
     * @remarks
     * Per-notification {@link TbxMatNotificationAction.iconPosition}
     * overrides this value. When neither is set, defaults to
     * `TbxMatNotificationIconPosition.Before`.
     *
     * @public
     */
    readonly iconPosition?: TbxMatNotificationIconPosition;

    /**
     * Default icon resolver service for action button icons application-wide
     *
     * @remarks
     * Per-notification {@link TbxMatNotificationAction.actionIconResolverService}
     * overrides this value. Required when any notification uses an icon-based
     * action and does not provide its own resolver.
     *
     * @public
     */
    readonly actionIconResolverService?: TbxMatIconResolver<string> & {
        readonly iconType: TbxMatIconType;
    };
}
