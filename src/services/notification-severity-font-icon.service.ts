import { Injectable } from '@angular/core';
import { TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES, TbxMatSeverityFontIconService, TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';

/**
 * Default font-based severity notification icon service
 *
 * @remarks
 * Extends `TbxMatSeverityFontIconService` from `@teqbench/tbx-mat-severity-theme`
 * and registers the shared default {@link https://fonts.google.com/icons | Material Symbols}
 * ligatures (`TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES`) for every severity level.
 * The inherited `resolve()` and severity methods (`default()`, `success()`,
 * `error()`, etc.) work via the registered mappings.
 *
 * ### fontSet resolution
 *
 * The fontSet is resolved by `TbxMatFontIconService`'s fallback chain:
 *
 * 1. **Explicit constructor argument** — `new TbxMatNotificationSeverityFontIconService('material-symbols-sharp')`
 * 2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`
 * 3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** —
 *    {@link https://material.angular.dev/components/icon/api | Angular Material}'s global icon default
 * 4. **Error** — if none of the above provides a fontSet
 *
 * For steps 1 and 2, the consuming component must bind `[fontSet]` on
 * `<mat-icon>`. For step 3, `<mat-icon>` already uses the global default —
 * no binding needed.
 *
 * @example Using with MAT_ICON_DEFAULT_OPTIONS (no explicit fontSet needed):
 * ```typescript
 * // app.config.ts
 * import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, TbxMatNotificationSeverityFontIconService }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-rounded' } },
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example Using with an explicit fontSet:
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
 * @example Using with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED }
 *     from '@teqbench/tbx-mat-icons';
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, TbxMatNotificationSeverityFontIconService }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     { provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED },
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
 *         }),
 *     },
 * ]
 * ```
 *
 * @category Services
 * @since 1.0.0
 * @related TBX_MAT_NOTIFICATION_PROVIDER_CONFIG
 * @related TbxMatNotificationSeveritySvgIconService
 *
 * @public
 */
@Injectable()
export class TbxMatNotificationSeverityFontIconService extends TbxMatSeverityFontIconService {
    /**
     * @param fontSet - Optional fontSet identifier (e.g., `'material-symbols-rounded'`).
     *                  When provided, takes precedence over all global defaults.
     *                  When omitted, falls back to `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET`,
     *                  then `MAT_ICON_DEFAULT_OPTIONS.fontSet`.
     */
    constructor(fontSet?: string) {
        super(fontSet);
    }

    /**
     * Register the shared default {@link https://fonts.google.com/icons | Material Symbols}
     * ligatures for every severity level
     *
     * @remarks
     * Iterates `TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES` from
     * `@teqbench/tbx-mat-severity-theme`, registering each level's ligature.
     * These work with any {@link https://fonts.google.com/icons | Material Symbols}
     * font variant (outlined, rounded, sharp) since the ligature names are
     * consistent across variants. Subclasses can override any of these
     * defaults by calling `register()` with the same key and a different ligature.
     *
     * @internal
     */
    protected override initialize(): void {
        super.initialize();
        for (const level of Object.values(TbxMatSeverityLevel)) {
            this.register(level, TBX_MAT_SEVERITY_DEFAULT_FONT_LIGATURES[level]);
        }
    }
}
