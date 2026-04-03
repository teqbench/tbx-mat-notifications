import { Injectable } from '@angular/core';
import {
    TbxMatSeveritySvgIconService,
    TbxMatSeverityLevelType,
} from '@teqbench/tbx-mat-severity-icons';

/**
 * Default SVG icons from the "Small Flat Vectors" collection on
 * {@link https://www.svgrepo.com/collection/small-flat-vectors/ | SVG Repo}.
 * License: PD (Public Domain — no attribution required)
 */
const SVG_SUCCESS =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -1028.4)"><path d="m3 1031.4v10c0 4.2 3.6322 8 9 10 5.368-2 9-5.8 9-10v-10h-18z" fill="#95a5a6"/><path d="m3 1030.4v10c0 4.2 3.6322 8 9 10 5.368-2 9-5.8 9-10v-10h-18z" fill="#ecf0f1"/><path d="m3 1030.4v10c0 4.2 3.6322 8 9 10v-20h-9z" fill="#bdc3c7"/><path d="m5 1032.4v8c0 3.4 2.8251 6.4 7 8 4.175-1.6 7-4.6 7-8v-8h-14z" fill="#27ae60"/><path d="m12 1032.4v16c4.175-1.6 7-4.6 7-8v-8h-7z" fill="#2ecc71"/><path d="m16 1037.4-4.683 4.6-1.9511-1.9-1.6586 1.7 1.9512 1.9 1.5615 1.6 0.097 0.1 6.342-6.4-1.659-1.6z" fill="#27ae60"/><path d="m16 1036.4-4.683 4.6-1.9511-1.9-1.6586 1.7 1.9512 1.9 1.5615 1.6 0.097 0.1 6.342-6.4-1.659-1.6z" fill="#ecf0f1"/></g></svg>';

const SVG_ERROR =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -1028.4)"><path d="m3 1031.4v10c0 4.2 3.6322 8 9 10 5.368-2 9-5.8 9-10v-10h-18z" fill="#95a5a6"/><path d="m3 1030.4v10c0 4.2 3.6322 8 9 10 5.368-2 9-5.8 9-10v-10h-18z" fill="#ecf0f1"/><path d="m3 1030.4v10c0 4.2 3.6322 8 9 10v-20h-9z" fill="#bdc3c7"/><path d="m5 1032.4v8c0 3.4 2.8251 6.4 7 8 4.175-1.6 7-4.6 7-8v-8h-14z" fill="#c0392b"/><path d="m12 1032.4v16c4.175-1.6 7-4.6 7-8v-8h-7z" fill="#e74c3c"/><path d="m9.1562 1036.5-1.4062 1.4 2.844 2.9-2.844 2.8 1.4062 1.4 2.8438-2.8 2.844 2.8 1.406-1.4-2.844-2.8 2.844-2.8-1.438-1.5-2.812 2.9-2.8438-2.9z" fill="#c0392b"/><path d="m9.1562 1035.5-1.4062 1.4 2.844 2.9-2.844 2.8 1.4062 1.4 2.8438-2.8 2.844 2.8 1.406-1.4-2.844-2.8 2.844-2.8-1.438-1.5-2.812 2.9-2.8438-2.9z" fill="#ecf0f1"/></g></svg>';

const SVG_WARNING =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -1028.4)"><path d="m3 1031.4v10c0 4.2 3.6322 8 9 10 5.368-2 9-5.8 9-10v-10h-18z" fill="#95a5a6"/><path d="m3 1030.4v10c0 4.2 3.6322 8 9 10 5.368-2 9-5.8 9-10v-10h-18z" fill="#ecf0f1"/><path d="m3 1030.4v10c0 4.2 3.6322 8 9 10v-20h-9z" fill="#bdc3c7"/><path d="m5 1032.4v8c0 3.4 2.8251 6.4 7 8 4.175-1.6 7-4.6 7-8v-8h-14z" fill="#f39c12"/><path d="m12 1032.4v16c4.175-1.6 7-4.6 7-8v-8h-7z" fill="#f1c40f"/><path d="m12 1034.4c-0.552 0-1 0.4-1 1l0.5 7h1l0.5-7c0-0.6-0.448-1-1-1zm0 9c-0.552 0-1 0.4-1 1 0 0.5 0.448 1 1 1s1-0.5 1-1c0-0.6-0.448-1-1-1z" fill="#34495e"/></g></svg>';

const SVG_INFORMATION =
    '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"><path d="m100 100v333.3c0 140 121.1 266.7 300 333.4 178.9-66.7 300-193.4 300-333.4v-333.3z" fill="#95a5a6"/><path d="m100 66.7v333.3c0 140 121.1 266.7 300 333.3 178.9-66.6 300-193.3 300-333.3v-333.3z" fill="#ecf0f1"/><path d="m100 66.7v333.3c0 140 121.1 266.7 300 333.3v-666.6z" fill="#bdc3c7"/><path d="m166.7 133.3v266.7c0 113.3 94.1 213.3 233.3 266.7 139.2-53.4 233.3-153.4 233.3-266.7v-266.7z" fill="#2980b9"/><path d="m400 133.3v533.4c139.2-53.4 233.3-153.4 233.3-266.7v-266.7z" fill="#3498db"/><path d="m366.7 199.3v66.7h66.6v-66.7zm-33.3 133.4l-33.3 33.3h66.6v200h-66.6v33.3h33.3 133.3 33.4v-33.3h-66.7v-233.3z" fill="#2980b9"/><path d="m366.7 166v66.7h66.6v-66.7zm-33.3 133.3l-33.3 33.4h66.6v200h-66.6v33.3h33.3 133.3 33.4v-33.3h-66.7v-233.4z" fill="#ecf0f1"/></svg>';

const SVG_HELP =
    '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"><path d="m100 100v333.3c0 140 121.1 266.7 300 333.4 178.9-66.7 300-193.4 300-333.4v-333.3z" fill="#95a5a6"/><path d="m100 66.7v333.3c0 140 121.1 266.7 300 333.3 178.9-66.6 300-193.3 300-333.3v-333.3z" fill="#ecf0f1"/><path d="m100 66.7v333.3c0 140 121.1 266.7 300 333.3v-666.6z" fill="#bdc3c7"/><path d="m166.7 133.3v266.7c0 113.3 94.1 213.3 233.3 266.7 139.2-53.4 233.3-153.4 233.3-266.7v-266.7z" fill="#2980b9"/><path d="m400 133.3v533.4c139.2-53.4 233.3-153.4 233.3-266.7v-266.7z" fill="#3498db"/><path d="m400 223.3c-57.6-3.3-114.4 36.7-128.1 93.4-1.4 10-1.8 13.3-5.2 40h66.6c-1.7-43.4 43.6-76.7 83.4-66.7 34 10 58.7 50 46.8 83.3-9.8 20-33.2 33.4-52 46.7-19.3 16.7-35.8 36.7-43.8 60-1.3 13.3-1.1 26.7-1 43.3h66.6v-33.3c5.8-23.3 23-36.7 41.7-46.7 21.1-10 36.2-26.6 46.9-46.6 18.1-33.4 15.1-73.4-4.2-103.4-23.5-43.3-68.9-73.3-117.7-70zm0 333.4c-18.4 0-33.3 13.3-33.3 33.3 0 16.7 14.9 33.3 33.3 33.3 18.4 0 33.3-16.6 33.3-33.3 0-20-14.9-33.3-33.3-33.3z" fill="#2980b9"/><path d="m400 190c-57.6-0.9-114.4 39.2-128.1 95.8-1.4 9.8-1.8 11-5.2 37.5h66.6c-1.7-41.6 43.6-76.3 83.4-64.5 34 7.9 58.7 47.6 46.8 81.2-9.8 22.8-33.2 33.1-52 46.9-19.3 16-35.8 36.4-43.8 60.4-1.3 14-1.1 28.6-1 42.7h66.6v-33.3c5.8-20.8 23-34.8 41.7-43.8 21.1-10.4 36.2-27.8 46.9-48.9 18.1-32.5 15.1-72.5-4.2-103.2-23.5-42.3-68.9-71.4-117.7-70.8zm0 333.3c-18.4 0-33.3 15-33.3 33.4 0 18.4 14.9 33.3 33.3 33.3 18.4 0 33.3-14.9 33.3-33.3 0-18.4-14.9-33.4-33.3-33.4z" fill="#ecf0f1"/></svg>';

/**
 * Default SVG-based notification icon service
 *
 * @remarks
 * Extends `TbxMatSeveritySvgIconService` from `@teqbench/tbx-mat-severity-icons`
 * and registers default SVG icons for each severity level. The inherited
 * `resolve()` and severity methods (`success()`, `error()`, etc.) work via the
 * registered mappings.
 *
 * Default icons are from the "Small Flat Vectors" collection on
 * {@link https://www.svgrepo.com/collection/small-flat-vectors/ | SVG Repo}
 * (PD license — no attribution required).
 *
 * Subclasses can override any default by overriding `initialize()` and
 * calling `register()` with the same key and different SVG markup.
 *
 * @example Using the defaults directly:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, TbxMatNotificationSvgIconService }
 *     from '@teqbench/tbx-mat-notifications';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new TbxMatNotificationSvgIconService(),
 *         }),
 *     },
 * ]
 * ```
 *
 * @example Subclassing with custom SVG markup:
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { TbxMatNotificationSvgIconService } from '@teqbench/tbx-mat-notifications';
 * import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
 *
 * // MyNotificationSvgIcons is a consumer-defined subclass
 * @Injectable()
 * export class MyNotificationSvgIcons extends TbxMatNotificationSvgIconService {
 *     protected override initialize(): void {
 *         super.initialize();
 *         this.register(TbxMatSeverityLevelType.Success, '<svg>...</svg>');
 *     }
 * }
 * ```
 *
 * @category Services
 * @since 1.0.0
 * @related TBX_MAT_NOTIFICATION_PROVIDER_CONFIG
 * @related TbxMatNotificationFontIconService
 *
 * @public
 */
@Injectable()
export class TbxMatNotificationSvgIconService extends TbxMatSeveritySvgIconService {
    /**
     * Register default SVG icons for each severity level
     *
     * @remarks
     * Icons are from the "Small Flat Vectors" collection on
     * {@link https://www.svgrepo.com/collection/small-flat-vectors/ | SVG Repo}
     * (PD license). Subclasses can override any of these defaults by calling
     * `register()` with the same key and different SVG markup.
     *
     * @internal
     */
    protected override initialize(): void {
        super.initialize();
        this.register(TbxMatSeverityLevelType.Success, SVG_SUCCESS);
        this.register(TbxMatSeverityLevelType.Error, SVG_ERROR);
        this.register(TbxMatSeverityLevelType.Warning, SVG_WARNING);
        this.register(TbxMatSeverityLevelType.Information, SVG_INFORMATION);
        this.register(TbxMatSeverityLevelType.Help, SVG_HELP);
    }
}
