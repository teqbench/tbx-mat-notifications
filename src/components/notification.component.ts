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
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { type NotificationData } from '../models/notification-data.model';

/** Default close icon when TBX_MAT_NOTIFICATION_PROVIDER_CONFIG is not provided or closeIcon is omitted. */
const DEFAULT_CLOSE_ICON = { name: 'close', type: 'font' as const };

/**
 * Custom snackbar content component for typed notifications.
 *
 * Rendered inside MatSnackBar via openFromComponent(). Receives its data
 * through MAT_SNACK_BAR_DATA injection token. The component displays an
 * optional severity icon, message text, and an optional dismiss button.
 *
 * ### Icon resolution
 *
 * The severity icon is shown by default (`data.showSeverityIcon === true`)
 * and can be hidden per-notification via {@link TbxMatNotificationConfig.showSeverityIcon}.
 *
 * When shown, icons are resolved via the {@link TBX_MAT_NOTIFICATION_PROVIDER_CONFIG}
 * injection token. When provided, the config's `severityIconResolverService` resolver
 * maps severity levels to icon identifiers (font ligatures or svgIcon names).
 * When not provided, the component falls back to hardcoded Material Symbols
 * font ligatures.
 *
 * The close/dismiss button is shown by default (`data.showCloseButton === true`)
 * and can be hidden per-notification via {@link TbxMatNotificationConfig.showCloseButton}.
 * When hidden, the notification is dismissed only by the duration timeout or
 * programmatically via `dismiss()` / `dismissAll()`.
 *
 * The close button icon is configured via `config.closeIcon`. When
 * omitted, it defaults to the `close` font ligature.
 *
 * Both severity icons and the close icon support font and SVG rendering.
 * The component detects the icon type from the config and renders the
 * appropriate `<mat-icon>` binding (`fontSet` + ligature for font icons,
 * `svgIcon` for SVG icons).
 *
 * ### Countdown bar
 *
 * Optionally renders a countdown progress bar along the bottom edge that
 * shrinks from full width to zero over the notification's duration. The
 * animation is pure CSS (no JavaScript timers) — the resolved duration
 * is passed as a CSS animation-duration via style binding, keeping the
 * countdown perfectly in sync with MatSnackBar's auto-dismiss timer.
 *
 * ### Styling
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
            @if (data.showSeverityIcon) {
                @let severitySvg = severityIconSvg();
                @if (severitySvg) {
                    <mat-icon
                        class="tbx-mat-notification-snackbar-icon"
                        [svgIcon]="severitySvg"
                    ></mat-icon>
                } @else {
                    <mat-icon class="tbx-mat-notification-snackbar-icon">{{
                        severityIconFont()
                    }}</mat-icon>
                }
            }
            <span>{{ data.message }}</span>
        </div>
        @if (data.showCloseButton) {
            <div matSnackBarActions class="tbx-mat-notification-snackbar-actions">
                <button
                    matIconButton
                    matSnackBarAction
                    (click)="data.dismiss()"
                    aria-label="Dismiss notification"
                >
                    @let closeSvg = closeIconSvg();
                    @if (closeSvg) {
                        <mat-icon [svgIcon]="closeSvg"></mat-icon>
                    } @else {
                        <mat-icon>{{ closeIconFont() }}</mat-icon>
                    }
                </button>
            </div>
        }
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
            padding: var(--tbx-mat-notification-padding, 0.25rem);
        }

        .tbx-mat-notification-snackbar-label {
            display: flex;
            align-items: center;
            gap: var(--tbx-mat-notification-label-gap, 1rem);
            flex-grow: 1;
            font-size: var(--tbx-mat-notification-font-size, inherit);
        }

        .tbx-mat-notification-snackbar-actions {
            padding-left: var(--tbx-mat-notification-actions-padding, 1rem);
        }

        .tbx-mat-notification-snackbar-icon {
            flex-shrink: 0;
            font-size: var(--tbx-mat-notification-icon-size, 1.5rem);
            width: var(--tbx-mat-notification-icon-size, 1.5rem);
            height: var(--tbx-mat-notification-icon-size, 1.5rem);
        }
    `,
})
export class NotificationComponent {
    readonly data = inject<NotificationData>(MAT_SNACK_BAR_DATA);
    private readonly config = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG, { optional: true });

    /** Hardcoded fallbacks when TBX_MAT_NOTIFICATION_PROVIDER_CONFIG is not provided. */
    private static readonly FALLBACK_ICONS: Readonly<Record<TbxMatSeverityLevelType, string>> = {
        [TbxMatSeverityLevelType.Success]: 'check_circle',
        [TbxMatSeverityLevelType.Error]: 'error',
        [TbxMatSeverityLevelType.Warning]: 'warning_amber',
        [TbxMatSeverityLevelType.Information]: 'info',
        [TbxMatSeverityLevelType.Help]: 'help',
    };

    /**
     * Resolved severity icon for font rendering.
     * Returns the ligature string when the icon is font-based, `null` when SVG.
     */
    readonly severityIconFont = computed(() => {
        const resolved = this.config?.severityIconResolverService.resolve(this.data.type);
        if (!resolved) {
            return NotificationComponent.FALLBACK_ICONS[this.data.type];
        }
        // If config has a font icon service (has fontSet property), it's font-based
        if ('fontSet' in this.config!.severityIconResolverService) {
            return resolved;
        }
        return null;
    });

    /**
     * Resolved severity icon for SVG rendering.
     * Returns the svgIcon name when the icon is SVG-based, `null` when font.
     */
    readonly severityIconSvg = computed(() => {
        const resolved = this.config?.severityIconResolverService.resolve(this.data.type);
        if (!resolved) {
            return null;
        }
        if ('fontSet' in this.config!.severityIconResolverService) {
            return null;
        }
        return resolved;
    });

    /** Close icon font ligature. `null` when the close icon is SVG-based. */
    readonly closeIconFont = computed(() => {
        const icon = this.config?.closeIcon ?? DEFAULT_CLOSE_ICON;
        return icon.type === 'font' ? icon.name : null;
    });

    /** Close icon svgIcon name. `null` when the close icon is font-based. */
    readonly closeIconSvg = computed(() => {
        const icon = this.config?.closeIcon ?? DEFAULT_CLOSE_ICON;
        return icon.type === 'svg' ? icon.name : null;
    });
}
