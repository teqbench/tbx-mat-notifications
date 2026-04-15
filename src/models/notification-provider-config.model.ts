import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';
import type { TbxMatSeverityResolver, TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

import { type TbxMatNotificationProviderActionConfig } from './notification-provider-action-config.model';

/**
 * Configuration for the notification component's injectable dependencies
 *
 * @remarks
 * Provided via the {@link TBX_MAT_NOTIFICATION_PROVIDER_CONFIG} injection token
 * in `app.config.ts`. Groups all notification icon customization and action
 * button defaults into a single provider entry.
 *
 * ### Properties
 *
 * - **`severityIconResolverService`** — resolves severity levels to icon identifiers. Must
 *   implement `TbxMatIconResolver` from `@teqbench/tbx-mat-icons`. Use
 *   {@link TbxMatNotificationSeverityFontIconService} for font icons or
 *   {@link TbxMatNotificationSeveritySvgIconService} for SVG icons.
 *
 * - **`closeIconResolverService`** (optional) — resolves the close button icon.
 *   When omitted, the package provides a default font-based resolver
 *   ({@link TbxMatNotificationCloseFontIconService}) that registers the `'close'`
 *   {@link https://fonts.google.com/icons | Material Symbols} ligature.
 *
 * - **`actionConfig`** (optional) — application-wide defaults for action button
 *   appearance, icon position, and icon resolver. See
 *   {@link TbxMatNotificationProviderActionConfig}. When omitted, defaults
 *   apply per-notification.
 *
 * @example Font icons with explicit fontSet:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, TbxMatNotificationSeverityFontIconService }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationSeverityFontIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example With custom close icon and action defaults:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, TbxMatNotificationSeverityFontIconService }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         // MyCloseIconService and MyActionIconService are hypothetical consumer-defined services
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationSeverityFontIconService('material-symbols-rounded'),
 *             closeIconResolverService: new MyCloseIconService('material-symbols-rounded'),
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
 * @since 1.0.0
 * @related TBX_MAT_NOTIFICATION_PROVIDER_CONFIG
 * @related TbxMatNotificationSeverityFontIconService
 * @related TbxMatNotificationSeveritySvgIconService
 * @related TbxMatNotificationCloseFontIconService
 * @related TbxMatNotificationProviderActionConfig
 *
 * @public
 */
export interface TbxMatNotificationProviderConfig {
    /**
     * Severity icon resolver — maps severity levels to icon identifiers
     *
     * @public
     */
    readonly severityIconResolverService: TbxMatSeverityResolver &
        TbxMatIconResolver<TbxMatSeverityLevel> & {
            readonly iconType: TbxMatIconType;
        };

    /**
     * Close button icon resolver — resolves the close/dismiss button icon
     *
     * @remarks
     * Must implement `TbxMatIconResolver<string>` and expose `iconType`.
     * When omitted, the package provides a default font-based resolver
     * ({@link TbxMatNotificationCloseFontIconService}) that registers the
     * `'close'` {@link https://fonts.google.com/icons | Material Symbols}
     * ligature. Consumers who want SVG close icons must provide a custom
     * resolver — no default SVG close icon service is provided.
     *
     * @public
     */
    readonly closeIconResolverService?: TbxMatIconResolver<string> & {
        readonly iconType: TbxMatIconType;
    };

    /**
     * Application-wide defaults for action button appearance and icon resolution
     *
     * @remarks
     * Per-notification {@link TbxMatNotificationAction} properties override
     * these defaults. When omitted entirely, action buttons use the
     * package defaults (`'text'` appearance,
     * `TbxMatNotificationIconPosition.Before`).
     *
     * @public
     */
    readonly actionConfig?: TbxMatNotificationProviderActionConfig;
}
