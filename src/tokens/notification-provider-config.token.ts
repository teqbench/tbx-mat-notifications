import { InjectionToken } from '@angular/core';
import type { TbxMatNotificationProviderConfig } from '../models/notification-provider-config.model';

/**
 * Injection token for notification component icon configuration.
 *
 * Provide in `app.config.ts` to configure the severity icon resolver service
 * and the close button icon for the notification component.
 *
 * ### Fallback behavior
 *
 * When this token is **not provided**, the notification component falls back
 * to hardcoded Material Symbols font ligatures for severity icons
 * (`check_circle`, `error`, `warning_amber`, `info`, `help`) and uses
 * `close` for the dismiss button. No `[fontSet]` binding is applied —
 * the component relies on the global `MAT_ICON_DEFAULT_OPTIONS` or
 * browser defaults.
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
 * @example SVG icons with a custom subclass:
 * ```typescript
 * // app.config.ts
 * import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '@teqbench/tbx-mat-notifications';
 * import { MyNotificationSvgIcons } from './my-notification-svg-icons.service';
 *
 * providers: [
 *     {
 *         provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
 *         useFactory: () => ({
 *             severityIconResolverService: new MyNotificationSvgIcons(),
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
 */
export const TBX_MAT_NOTIFICATION_PROVIDER_CONFIG =
    new InjectionToken<TbxMatNotificationProviderConfig>('TBX_MAT_NOTIFICATION_PROVIDER_CONFIG');
