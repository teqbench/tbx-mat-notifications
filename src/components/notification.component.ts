import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
} from '@angular/material/snack-bar';
import { SeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { NOTIFICATION_ICON_SERVICE } from '../tokens/notification-icon-service.token';
import { type NotificationData } from '../models/notification-data.model';

/**
 * Custom snackbar content component for typed notifications.
 *
 * Rendered inside MatSnackBar via openFromComponent(). Receives its data
 * through MAT_SNACK_BAR_DATA injection token. The component displays a
 * severity icon, message text, and a dismiss button.
 *
 * Icon resolution is delegated to the injected NOTIFICATION_ICON_SERVICE,
 * ensuring notifications use icons optimized for flat snackbar panels
 * (outline variants by default). Downstream apps swap the icon set via
 * { provide: NOTIFICATION_ICON_SERVICE, useClass: ... } in app.config.ts.
 *
 * Optionally renders a countdown progress bar along the bottom edge that
 * shrinks from full width to zero over the notification's duration. The
 * animation is pure CSS (no JavaScript timers) — the resolved duration
 * is passed as a CSS animation-duration via style binding, keeping the
 * countdown perfectly in sync with MatSnackBar's auto-dismiss timer.
 *
 * Styling uses M3 tokens applied via panel classes on the MatSnackBar
 * container (set by NotificationService). The component itself only
 * handles layout — color comes from the panel class.
 *
 * This component is internal to the notification system. Consumers use
 * NotificationService, never this component directly.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'tbx-snackbar-notification',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSnackBarAction,
        MatSnackBarActions,
        MatSnackBarLabel,
    ],
    template: `
        <div class="snackbar-container">
            <mat-icon class="snackbar-icon">{{ icon() }}</mat-icon>
            <span matSnackBarLabel>{{ data.message }}</span>
            <span matSnackBarActions>
                <button
                    matIconButton
                    matSnackBarAction
                    (click)="data.dismiss()"
                    aria-label="Dismiss notification"
                >
                    <mat-icon>close</mat-icon>
                </button>
            </span>
        </div>
        @if (data.showCountdown) {
            <!-- Countdown uses a pure CSS scaleX animation rather than mat-progress-bar.
                mat-progress-bar requires a JavaScript timer to increment its value property —
                it cannot self-animate from 100% to 0%. The CSS approach runs on the compositor
                thread (60fps, no layout recalc), requires zero JS, and stays perfectly in sync
                with MatSnackBar's auto-dismiss because the same duration value drives both. -->
            <div class="snackbar-countdown" [style.animation-duration.ms]="data.duration"></div>
        }
    `,
    styles: `
        [matSnackBarLabel] {
            flex: 1;
        }

        .snackbar-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
        }

        .snackbar-icon {
            flex-shrink: 0;
        }
    `,
})
export class NotificationComponent {
    readonly data = inject<NotificationData>(MAT_SNACK_BAR_DATA);
    private readonly icons = inject(NOTIFICATION_ICON_SERVICE, { optional: true });

    /** Hardcoded fallbacks when NOTIFICATION_ICON_SERVICE is not provided. */
    private static readonly FALLBACK_ICONS: Readonly<Record<SeverityLevelType, string>> = {
        [SeverityLevelType.Success]: 'check_circle',
        [SeverityLevelType.Error]: 'error',
        [SeverityLevelType.Warning]: 'warning_amber',
        [SeverityLevelType.Information]: 'info',
        [SeverityLevelType.Help]: 'help',
    };

    readonly icon = computed(() => this.resolveIcon(this.data.type));

    /**
     * Map SeverityLevelType to the corresponding icon ligature.
     * Delegates to the injected SeverityIconService.resolve() when available,
     * falling back to hardcoded ligatures if the icon service is not provided
     * or returns a falsy value.
     */
    private resolveIcon(type: SeverityLevelType): string {
        const resolved = this.icons?.resolve(type);
        return resolved || NotificationComponent.FALLBACK_ICONS[type];
    }
}
