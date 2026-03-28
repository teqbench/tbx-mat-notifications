import { InjectionToken } from '@angular/core';
import type { TbxMatSeverityIconService } from '@teqbench/tbx-mat-severity-icons';

/**
 * Optional injection token for customizing notification icons.
 *
 * Provide a TbxMatSeverityIconService implementation to override the default
 * hardcoded Material Icons ligatures used by NotificationComponent.
 *
 * ```typescript
 * providers: [
 *     { provide: TBX_MAT_NOTIFICATION_ICON_SERVICE, useClass: TbxMatNotificationIconService },
 * ]
 * ```
 */
export const TBX_MAT_NOTIFICATION_ICON_SERVICE = new InjectionToken<TbxMatSeverityIconService>(
    'TBX_MAT_NOTIFICATION_ICON_SERVICE'
);
