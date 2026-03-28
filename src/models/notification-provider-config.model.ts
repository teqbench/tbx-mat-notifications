import type { ITbxIconResolver } from '@teqbench/tbx-mat-icons';
import type { ITbxSeverityResolver, TbxSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';

/**
 * Configuration for the notification component's injectable dependencies.
 *
 * Provided via the {@link TBX_MAT_NOTIFICATION_PROVIDER_CONFIG} injection token
 * in `app.config.ts`. Groups all notification icon customization into a single
 * provider entry.
 *
 * ### Properties
 *
 * - **`severityIconResolverService`** — resolves severity levels to icon identifiers. Must
 *   implement {@link ITbxSeverityResolver}. Use {@link TbxMatNotificationFontIconService}
 *   for font icons or {@link TbxMatNotificationSvgIconService} for SVG icons.
 *
 * - **`closeIcon`** (optional) — configures the dismiss button icon. When omitted,
 *   defaults to the `close` Material Symbols font ligature.
 *
 * ### Examples
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
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
 *             closeIcon: { name: 'cancel', type: 'font' },
 *         }),
 *     },
 * ]
 * ```
 *
 * @example With an SVG close icon:
 * ```typescript
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
 *             closeIcon: { name: 'my-close-icon', type: 'svg' },
 *         }),
 *     },
 * ]
 * ```
 */
export interface TbxMatNotificationProviderConfig {
    /** Severity icon resolver — maps severity levels to icon identifiers. */
    readonly severityIconResolverService: ITbxSeverityResolver &
        ITbxIconResolver<TbxSeverityLevelType>;

    /**
     * Close/dismiss button icon configuration.
     *
     * - `name` — the icon identifier (font ligature or registered svgIcon name)
     * - `type` — `'font'` for font ligature, `'svg'` for registered svgIcon
     *
     * Defaults to `{ name: 'close', type: 'font' }` when omitted.
     */
    readonly closeIcon?: {
        readonly name: string;
        readonly type: 'font' | 'svg';
    };
}
