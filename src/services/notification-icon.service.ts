import { Injectable } from '@angular/core';
import { TbxMatSeverityIconService } from '@teqbench/tbx-mat-severity-icons';

/**
 * Default notification icon service.
 *
 * Provides icon ligatures for each severity level using whichever font set
 * is resolved by the fallback chain:
 *
 * 1. Explicit `fontSet` passed to the constructor
 * 2. Application-level `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token
 * 3. Error if neither is configured
 *
 * Consumers can use this implementation directly or provide their own
 * TbxMatSeverityIconService subclass via the TBX_MAT_NOTIFICATION_ICON_SERVICE
 * injection token.
 */
@Injectable()
export class TbxMatNotificationIconService extends TbxMatSeverityIconService {
    /**
     * @param fontSet - Optional font set identifier (e.g., `'material-symbols-rounded'`).
     *                  When provided, takes precedence over the application-level default.
     *                  When omitted, falls back to the `TBX_MAT_FONT_ICON_DEFAULT_FONT_SET` token.
     */
    constructor(fontSet?: string) {
        super(fontSet);
    }

    override success(): string {
        return 'check_circle';
    }

    override error(): string {
        return 'error';
    }

    override warning(): string {
        return 'warning_amber';
    }

    override information(): string {
        return 'info';
    }

    override help(): string {
        return 'help';
    }
}
