import { Injectable } from '@angular/core';
import {
    TbxMatSeverityFontIconService,
    TbxMatSeverityLevelType,
} from '@teqbench/tbx-mat-severity-icons';

/**
 * Default font-based notification icon service.
 *
 * Extends {@link TbxMatSeverityFontIconService} and registers Material Symbols
 * ligatures for each severity level. The inherited `resolve()` and severity
 * methods (`success()`, `error()`, etc.) work via the registered mappings.
 *
 * ### fontSet resolution
 *
 * The fontSet is resolved by {@link TbxMatFontIconService}'s fallback chain:
 *
 * 1. **Explicit constructor argument** — `new TbxMatNotificationFontIconService('material-symbols-sharp')`
 * 2. **`TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token** — set once in `app.config.ts`
 * 3. **`MAT_ICON_DEFAULT_OPTIONS.fontSet`** — Angular Material's global icon default
 * 4. **Error** — if none of the above provides a fontSet
 *
 * For steps 1 and 2, the consuming component must bind `[fontSet]` on
 * `<mat-icon>`. For step 3, `<mat-icon>` already uses the global default —
 * no binding needed.
 *
 * ### Examples
 *
 * @example Using with MAT_ICON_DEFAULT_OPTIONS (no explicit fontSet needed):
 * ```typescript
 * // app.config.ts
 * import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '@teqbench/tbx-mat-notifications';
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
 *
 * // Component — no [fontSet] binding needed, <mat-icon> uses the global default:
 * // readonly config = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG);
 * // readonly severity = TbxMatSeverityLevelType.Success;
 * // <mat-icon>{{ config.severityIconResolverService.resolve(severity) }}</mat-icon>
 * ```
 *
 * @example Using with an explicit fontSet:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService('material-symbols-rounded'),
 *         }),
 *     },
 * ]
 *
 * // Component — must bind [fontSet] since fontSet was set explicitly:
 * // readonly config = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG);
 * // readonly severity = TbxMatSeverityLevelType.Success;
 * // <mat-icon [fontSet]="config.severityIconResolverService.fontSet">
 * //     {{ config.severityIconResolverService.resolve(severity) }}
 * // </mat-icon>
 * ```
 *
 * @example Using with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED }
 *     from '@teqbench/tbx-mat-icons';
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     { provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED },
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationFontIconService(),
 *         }),
 *     },
 * ]
 *
 * // Component — must bind [fontSet] since fontSet was set via token:
 * // readonly config = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG);
 * // readonly severity = TbxMatSeverityLevelType.Success;
 * // <mat-icon [fontSet]="config.severityIconResolverService.fontSet">
 * //     {{ config.severityIconResolverService.resolve(severity) }}
 * // </mat-icon>
 * ```
 */
@Injectable()
export class TbxMatNotificationFontIconService extends TbxMatSeverityFontIconService {
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
     * Register default Material Symbols ligature names for each severity level.
     *
     * These work with any Material Symbols font variant (outlined, rounded,
     * sharp, etc.) since the ligature names are consistent across variants.
     * Subclasses can override any of these defaults by calling `register()`
     * with the same key and a different ligature.
     */
    protected override initialize(): void {
        super.initialize();
        this.register(TbxMatSeverityLevelType.Success, 'check_circle');
        this.register(TbxMatSeverityLevelType.Error, 'error');
        this.register(TbxMatSeverityLevelType.Warning, 'warning_amber');
        this.register(TbxMatSeverityLevelType.Information, 'info');
        this.register(TbxMatSeverityLevelType.Help, 'help');
    }
}
