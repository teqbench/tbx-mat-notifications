import { Injectable } from '@angular/core';
import { SeverityIconService } from '@teqbench/tbx-mat-severity-icons';

/**
 * Default notification icon service using Material Symbols Rounded.
 *
 * Provides icon ligatures for each severity level. Consumers can use this
 * implementation directly or provide their own SeverityIconService subclass
 * via the NOTIFICATION_ICON_SERVICE injection token.
 */
@Injectable()
export class NotificationIconService extends SeverityIconService {
    constructor() {
        super('material-symbols-rounded');
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
