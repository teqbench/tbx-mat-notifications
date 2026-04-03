import { InjectionToken } from '@angular/core';
import type { TbxMatNotificationProviderConfig } from '../models/notification-provider-config.model';

/**
 * Injection token for notification component icon configuration
 *
 * @remarks
 * **Required.** Provide in `app.config.ts` to configure the severity icon
 * resolver service and the close button icon. Use
 * {@link TbxMatNotificationFontIconService} for font icons or
 * {@link TbxMatNotificationSvgIconService} for SVG icons — both ship
 * with sensible defaults.
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
 * // MyNotificationSvgIcons is a consumer-defined subclass of TbxMatNotificationSvgIconService
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
 * @category Tokens
 * @since 1.0.0
 * @related TbxMatNotificationProviderConfig
 * @related TbxMatNotificationFontIconService
 * @related TbxMatNotificationSvgIconService
 *
 * @public
 */
export const TBX_MAT_NOTIFICATION_PROVIDER_CONFIG =
    new InjectionToken<TbxMatNotificationProviderConfig>('TBX_MAT_NOTIFICATION_PROVIDER_CONFIG');
