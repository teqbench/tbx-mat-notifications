import { type TbxMatIconResolver, type TbxMatIconType } from '@teqbench/tbx-mat-icons';
import type {
    TbxMatSeverityResolver,
    TbxMatSeverityLevelType,
} from '@teqbench/tbx-mat-severity-icons';

/**
 * Configuration for the notification component's injectable dependencies
 *
 * @remarks
 * Provided via the {@link TBX_MAT_NOTIFICATION_PROVIDER_CONFIG} injection token
 * in `app.config.ts`. Groups all notification icon customization into a single
 * provider entry.
 *
 * ### Properties
 *
 * - **`severityIconResolverService`** — resolves severity levels to icon identifiers. Must
 *   implement `TbxMatIconResolver` from `@teqbench/tbx-mat-icons`. Use
 *   {@link TbxMatNotificationFontIconService} for font icons or
 *   {@link TbxMatNotificationSvgIconService} for SVG icons.
 *
 * - **`closeIcon`** (optional) — configures the dismiss button icon. When omitted,
 *   defaults to the `close` {@link https://fonts.google.com/icons | Material Symbols} font ligature.
 *
 * @example Font icons with explicit fontSet:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, TbxMatNotificationFontIconService }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example Font icons with MAT_ICON_DEFAULT_OPTIONS (no explicit fontSet):
 * ```typescript
 * // app.config.ts
 * import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, TbxMatNotificationFontIconService }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService(),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example With a custom close icon:
 * ```typescript
 * import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
 *             closeIcon: { name: 'cancel', type: TbxMatIconType.Font },
 *         }),
 *     },
 * ]
 * ```
 *
 * @example With an SVG close icon:
 * ```typescript
 * import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
 *             closeIcon: { name: 'my-close-icon', type: TbxMatIconType.Svg },
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Models
 * @since 1.0.0
 * @related TBX_MAT_NOTIFICATION_PROVIDER_CONFIG
 * @related TbxMatNotificationFontIconService
 * @related TbxMatNotificationSvgIconService
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
        TbxMatIconResolver<TbxMatSeverityLevelType> & {
            readonly iconType: TbxMatIconType;
        };

    /**
     * Close/dismiss button icon configuration
     *
     * @remarks
     * - `name` — the icon identifier (font ligature or registered svgIcon name)
     * - `type` — `'font'` for font ligature, `'svg'` for registered svgIcon
     *
     * Defaults to `{ name: 'close', type: 'font' }` when omitted.
     *
     * @public
     */
    readonly closeIcon?: {
        readonly name: string;
        readonly type: TbxMatIconType;
    };
}
