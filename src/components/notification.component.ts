import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { type NotificationDataDto } from '../models/notification-data-dto.model';
import { TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';

/**
 * Custom snackbar content component for typed notifications
 *
 * @remarks
 * Rendered inside {@link https://material.angular.dev/components/snack-bar/api | MatSnackBar}
 * via `openFromComponent()`. Receives its data through `MAT_SNACK_BAR_DATA`
 * injection token as an internal DTO.
 *
 * ### Template element order
 *
 * severity icon | message | action button | close button
 *
 * All elements are optional except the message. The action button and
 * close button both render within `matSnackBarActions` and use the
 * `matSnackBarAction` directive.
 *
 * ### Action button rendering
 *
 * When `data.actionLabel` is set, the component renders an action button.
 * The button appearance is determined by `data.actionButtonType`:
 * - `'text'` / `'filled'` / `'elevated'` / `'outlined'` / `'tonal'` —
 *   renders `mat-button` with `[appearance]` binding and optional icon.
 * - `'icon'` — renders `mat-icon-button` with `aria-label` from `data.actionLabel`.
 *
 * ### Countdown bar
 *
 * Renders only when `data.showCountdown` is `true` AND `data.duration`
 * is positive (not indefinite). Setting `showCountdown: true` with
 * `duration <= 0` has no visible effect — an indefinite notification
 * has no countdown to display.
 *
 * @example Rendered internally by TbxMatNotificationService:
 * ```typescript
 * // Consumers do not instantiate this component directly.
 * // It is rendered via MatSnackBar.openFromComponent() by the service.
 * void this.notificationService.success('Item saved.');
 * ```
 *
 * @category Components
 * @displayName Notification Component
 * @since 1.0.0
 * @related TbxMatNotificationService
 *
 * @public
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'tbx-mat-notification-component',
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
                        aria-hidden="true"
                    ></mat-icon>
                } @else {
                    <mat-icon class="tbx-mat-notification-snackbar-icon" aria-hidden="true">{{
                        severityIconFont()
                    }}</mat-icon>
                }
            }
            <span>{{ data.message }}</span>
        </div>
        @if (data.actionLabel || data.showCloseButton) {
            <div matSnackBarActions class="tbx-mat-notification-snackbar-actions">
                @if (data.actionLabel) {
                    @if (data.actionButtonType === 'icon') {
                        <button
                            mat-icon-button
                            matSnackBarAction
                            (click)="data.dismissByAction()"
                            [attr.aria-label]="data.actionLabel"
                        >
                            @let actionSvg = actionIconSvg();
                            @if (actionSvg) {
                                <mat-icon [svgIcon]="actionSvg"></mat-icon>
                            } @else {
                                <mat-icon>{{ actionIconFont() }}</mat-icon>
                            }
                        </button>
                    } @else {
                        <button
                            mat-button
                            matSnackBarAction
                            [appearance]="data.actionButtonType ?? 'text'"
                            (click)="data.dismissByAction()"
                        >
                            @if (
                                data.actionIconName &&
                                data.actionIconPosition === iconPositionBefore
                            ) {
                                @let actionSvgBefore = actionIconSvg();
                                @if (actionSvgBefore) {
                                    <mat-icon
                                        [svgIcon]="actionSvgBefore"
                                        aria-hidden="true"
                                    ></mat-icon>
                                } @else {
                                    <mat-icon aria-hidden="true">{{ actionIconFont() }}</mat-icon>
                                }
                            }
                            {{ data.actionLabel }}
                            @if (
                                data.actionIconName && data.actionIconPosition === iconPositionAfter
                            ) {
                                @let actionSvgAfter = actionIconSvg();
                                @if (actionSvgAfter) {
                                    <mat-icon
                                        [svgIcon]="actionSvgAfter"
                                        aria-hidden="true"
                                    ></mat-icon>
                                } @else {
                                    <mat-icon aria-hidden="true">{{ actionIconFont() }}</mat-icon>
                                }
                            }
                        </button>
                    }
                }
                @if (data.showCloseButton) {
                    <button
                        mat-icon-button
                        matSnackBarAction
                        class="tbx-mat-notification-close-button"
                        (click)="data.dismissByClose()"
                        aria-label="Dismiss notification"
                    >
                        @let closeSvg = closeIconSvg();
                        @if (closeSvg) {
                            <mat-icon [svgIcon]="closeSvg"></mat-icon>
                        } @else {
                            <mat-icon>{{ closeIconFont() }}</mat-icon>
                        }
                    </button>
                }
            </div>
        }
        @if (data.showCountdown && data.duration > 0) {
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
            display: flex;
            align-items: center;
            gap: var(--tbx-mat-notification-actions-gap, 0.5rem);
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
export class TbxMatNotificationComponent {
    readonly data = inject<NotificationDataDto>(MAT_SNACK_BAR_DATA);
    private readonly config = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG);

    /** Enum value exposed for template comparison. */
    protected readonly iconPositionBefore = TbxMatNotificationIconPosition.Before;
    /** Enum value exposed for template comparison. */
    protected readonly iconPositionAfter = TbxMatNotificationIconPosition.After;

    /**
     * Resolved severity icon for font rendering.
     * Returns the ligature string when the icon is font-based, `null` when SVG.
     */
    readonly severityIconFont = computed(() => {
        const resolved = this.config.severityIconResolverService.resolve(this.data.type);
        if (!resolved || this.config.severityIconResolverService.iconType !== TbxMatIconType.Font) {
            return null;
        }
        return resolved;
    });

    /**
     * Resolved severity icon for SVG rendering.
     * Returns the svgIcon name when the icon is SVG-based, `null` when font.
     */
    readonly severityIconSvg = computed(() => {
        const resolved = this.config.severityIconResolverService.resolve(this.data.type);
        if (!resolved || this.config.severityIconResolverService.iconType !== TbxMatIconType.Svg) {
            return null;
        }
        return resolved;
    });

    /** Close icon font ligature. `null` when the close icon is SVG-based. */
    readonly closeIconFont = computed(() => {
        const resolver = this.data.closeIconResolverService;
        if (resolver.iconType !== TbxMatIconType.Font) {
            return null;
        }
        return resolver.resolve('close') ?? null;
    });

    /** Close icon svgIcon name. `null` when the close icon is font-based. */
    readonly closeIconSvg = computed(() => {
        const resolver = this.data.closeIconResolverService;
        if (resolver.iconType !== TbxMatIconType.Svg) {
            return null;
        }
        return resolver.resolve('close') ?? null;
    });

    /** Action icon font ligature. `null` when the action icon is SVG-based or not configured. */
    readonly actionIconFont = computed(() => {
        const resolver = this.data.actionIconResolverService;
        const iconName = this.data.actionIconName;
        if (!resolver || !iconName || resolver.iconType !== TbxMatIconType.Font) {
            return null;
        }
        return resolver.resolve(iconName) ?? null;
    });

    /** Action icon svgIcon name. `null` when the action icon is font-based or not configured. */
    readonly actionIconSvg = computed(() => {
        const resolver = this.data.actionIconResolverService;
        const iconName = this.data.actionIconName;
        if (!resolver || !iconName || resolver.iconType !== TbxMatIconType.Svg) {
            return null;
        }
        return resolver.resolve(iconName) ?? null;
    });
}
