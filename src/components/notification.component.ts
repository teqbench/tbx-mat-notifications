import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { TBX_MAT_NOTIFICATION_ICON_SERVICE } from '../tokens/notification-icon-service.token';
import { type NotificationData } from '../models/notification-data.model';

/**
 * Custom snackbar content component for typed notifications.
 *
 * Rendered inside MatSnackBar via openFromComponent(). Receives its data
 * through MAT_SNACK_BAR_DATA injection token. The component displays a
 * severity icon, message text, and a dismiss button.
 *
 * Icon resolution is delegated to the injected TBX_MAT_NOTIFICATION_ICON_SERVICE,
 * ensuring notifications use icons optimized for flat snackbar panels
 * (outline variants by default). Downstream apps swap the icon set via
 * { provide: TBX_MAT_NOTIFICATION_ICON_SERVICE, useClass: ... } in app.config.ts.
 *
 * Optionally renders a countdown progress bar along the bottom edge that
 * shrinks from full width to zero over the notification's duration. The
 * animation is pure CSS (no JavaScript timers) — the resolved duration
 * is passed as a CSS animation-duration via style binding, keeping the
 * countdown perfectly in sync with MatSnackBar's auto-dismiss timer.
 *
 * Styling uses M3 tokens applied via panel classes on the MatSnackBar
 * container (set by TbxMatNotificationService). The component itself only
 * handles layout — color comes from the panel class.
 *
 * This component is internal to the notification system. Consumers use
 * TbxMatNotificationService, never this component directly.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'tbx-mat-notification-snackbar',
    imports: [
        MatSnackBarLabel,
        MatSnackBarActions,
        MatSnackBarAction,
        MatButtonModule,
        MatIconModule,
    ],
    template: `
        <div matSnackBarLabel class="tbx-mat-notification-snackbar-label">
            <mat-icon class="tbx-mat-notification-snackbar-icon">{{ icon() }}</mat-icon>
            <span>{{ data.message }}</span>
        </div>
        <div matSnackBarActions class="tbx-mat-notification-snackbar-actions">
            <button
                matIconButton
                matSnackBarAction
                (click)="data.dismiss()"
                aria-label="Dismiss notification"
            >
                <mat-icon>close</mat-icon>
            </button>
        </div>
        @if (data.showCountdown) {
            <div
                class="tbx-mat-notification-snackbar-countdown"
                [style.animation-duration.ms]="data.duration"
            ></div>
        }
    `,
    styles: `
        :host {
            display: flex;
            padding: 0.25rem;
        }

        .tbx-mat-notification-snackbar-label {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-grow: 1;
        }

        .tbx-mat-notification-snackbar-actions {
            padding-left: 1rem;
        }

        .tbx-mat-notification-snackbar-icon {
            flex-shrink: 0;
        }
    `,
})
export class NotificationComponent {
    readonly data = inject<NotificationData>(MAT_SNACK_BAR_DATA);
    private readonly icons = inject(TBX_MAT_NOTIFICATION_ICON_SERVICE, { optional: true });

    /** Hardcoded fallbacks when TBX_MAT_NOTIFICATION_ICON_SERVICE is not provided. */
    private static readonly FALLBACK_ICONS: Readonly<Record<TbxMatSeverityLevelType, string>> = {
        [TbxMatSeverityLevelType.Success]: 'check_circle',
        [TbxMatSeverityLevelType.Error]: 'error',
        [TbxMatSeverityLevelType.Warning]: 'warning_amber',
        [TbxMatSeverityLevelType.Information]: 'info',
        [TbxMatSeverityLevelType.Help]: 'help',
    };

    readonly icon = computed(() => this.resolveIcon(this.data.type));

    /**
     * Map TbxMatSeverityLevelType to the corresponding icon ligature.
     * Delegates to the injected TbxMatSeverityIconService.resolve() when available,
     * falling back to hardcoded ligatures if the icon service is not provided
     * or returns a falsy value.
     */
    private resolveIcon(type: TbxMatSeverityLevelType): string {
        const resolved = this.icons?.resolve(type);
        return resolved || NotificationComponent.FALLBACK_ICONS[type];
    }
}
