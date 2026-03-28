import { InjectionToken } from '@angular/core';
import type { TbxMatNotificationProviderConfig } from '../models/notification-provider-config.model';

/**
 * Injection token for notification component icon configuration.
 *
 * Provide in `app.config.ts` to configure severity icons and the
 * close button icon for the notification component.
 *
 * When not provided, the notification component falls back to hardcoded
 * Material Symbols font ligatures for severity icons and uses `close`
 * for the dismiss button.
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
 * @example Font icons with MAT_ICON_DEFAULT_OPTIONS:
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
 */
export const TBX_MAT_NOTIFICATION_PROVIDER_CONFIG =
    new InjectionToken<TbxMatNotificationProviderConfig>('TBX_MAT_NOTIFICATION_PROVIDER_CONFIG');
