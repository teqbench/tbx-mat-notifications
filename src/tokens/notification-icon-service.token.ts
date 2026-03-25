import { InjectionToken } from '@angular/core';
import type { SeverityIconService } from '@teqbench/tbx-mat-severity-icons';

/**
 * Optional injection token for customizing notification icons.
 *
 * Provide a SeverityIconService implementation to override the default
 * hardcoded Material Icons ligatures used by NotificationComponent.
 *
 * ```typescript
 * providers: [
 *     { provide: NOTIFICATION_ICON_SERVICE, useClass: NotificationIconService },
 * ]
 * ```
 */
export const NOTIFICATION_ICON_SERVICE = new InjectionToken<SeverityIconService>(
    'NOTIFICATION_ICON_SERVICE'
);
