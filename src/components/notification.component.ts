import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { type NotificationDataDto } from '../models/notification-data-dto.model';

/** Resolved icon ready for template rendering. */
interface ResolvedIcon {
    readonly name: string;
    readonly isSvg: boolean;
}

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
 *   renders `mat-button` with `[matButton]` input binding and optional icon.
 * - `'icon'` — renders `mat-icon-button` with `aria-label` from `data.actionLabel`.
 *
 * ### Icon rendering
 *
 * Icons are resolved to a `ResolvedIcon` (`{ name, isSvg }`) via computed
 * signals and a shared `resolveIcon()` helper. Three icon categories exist:
 * severity, action, and close — each backed by a resolver service that
 * determines whether to render a font ligature or an SVG icon.
 *
 * Most icon sites use a shared `ng-template` (`#tbxNgIconTemplate`) via
 * `ngTemplateOutlet` to eliminate font/SVG branching duplication. However,
 * **labeled action button icons cannot use `ngTemplateOutlet`** due to an
 * {@link https://angular.dev | Angular} content projection constraint:
 *
 * {@link https://material.angular.dev/components/button/api | Angular Material}'s
 * button component uses `ng-content select` to project `mat-icon` elements
 * into leading and trailing slots:
 * - `mat-icon:not([iconPositionEnd])` — leading slot (before the label)
 * - `mat-icon[iconPositionEnd]` — trailing slot (after the label)
 *
 * Content projection selectors match against **direct template children**
 * of the host element. When `mat-icon` is rendered via `ngTemplateOutlet`
 * or wrapped in `ng-container`, Angular sees `ng-container` — not
 * `mat-icon` — as the direct child, and the icon falls into the default
 * `<ng-content>` slot (`.mdc-button__label`) instead of the icon slot.
 * This breaks icon/text alignment because the icon is inside the label
 * span rather than a flex sibling of it.
 *
 * To satisfy the projection selectors, labeled action buttons render
 * `mat-icon` directly in the template as a child of the button. The
 * icon position and font/SVG branching use `@if` / `@else if` chains
 * with no `@else` fallback — when no condition matches, nothing renders
 * and the button has no icon children. This avoids the `@if`/`@else`
 * problem where the `@else` branch would always render an unwanted icon.
 * Both branches of the font/SVG `@if` produce a `mat-icon` element, so
 * Angular resolves the projection slot based on element tag + attributes.
 *
 * Icon-only buttons (`mat-icon-button`), severity icons, and close icons
 * do not rely on button content projection slots, so they use the shared
 * `ngTemplateOutlet` pattern.
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
    imports: [NgTemplateOutlet, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatButtonModule, MatIconModule],
    template: `
        <!-- Shared icon template — handles font ligature vs SVG branching -->
        <ng-template #tbxNgIconTemplate let-icon="icon" let-class="class">
            @if (icon) {
                @if (icon.isSvg) {
                    <mat-icon [svgIcon]="icon.name" [class]="class" aria-hidden="true"></mat-icon>
                } @else {
                    <mat-icon [class]="class" aria-hidden="true">{{ icon.name }}</mat-icon>
                }
            }
        </ng-template>

        <div matSnackBarLabel class="tbx-mat-notification-snackbar-label">
            @if (data.showSeverityIcon) {
                <ng-container
                    *ngTemplateOutlet="
                        tbxNgIconTemplate;
                        context: {
                            icon: severityIcon(),
                            class: 'tbx-mat-notification-snackbar-icon',
                        }
                    "
                ></ng-container>
            }
            <span>{{ data.message }}</span>
        </div>
        @if (data.actionLabel || data.showCloseButton) {
            <div matSnackBarActions class="tbx-mat-notification-snackbar-actions">
                @if (data.actionLabel) {
                    @if (data.actionButtonType === 'icon') {
                        <button mat-icon-button matSnackBarAction (click)="data.dismissByAction()" [attr.aria-label]="data.actionLabel">
                            <ng-container *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: actionIcon() }"></ng-container>
                        </button>
                    } @else {
                        <!-- icon is null when no actionIconResolverService or
                             actionIconName is configured. The service only sets
                             actionIconPosition when an icon is configured, so
                             the position check alone would guard against null
                             in practice. The explicit icon && guard is defensive —
                             it prevents rendering an empty mat-icon if a future
                             code path sets actionIconPosition without an icon. -->
                        @let icon = actionIcon();
                        <button matSnackBarAction class="tbx-mat-notification-action-button" [matButton]="data.actionButtonType ?? 'text'" (click)="data.dismissByAction()">
                            @if (data.actionIconPosition === 'before' && icon && icon?.isSvg) {
                                <mat-icon [svgIcon]="icon?.name" aria-hidden="true"></mat-icon>
                            } @else if (data.actionIconPosition === 'before' && icon && !icon?.isSvg) {
                                <mat-icon aria-hidden="true">{{ icon?.name }}</mat-icon>
                            }

                            {{ data.actionLabel }}

                            @if (data.actionIconPosition === 'after' && icon && icon?.isSvg) {
                                <mat-icon iconPositionEnd [svgIcon]="icon?.name" aria-hidden="true"></mat-icon>
                            } @else if (data.actionIconPosition === 'after' && icon && !icon?.isSvg) {
                                <mat-icon iconPositionEnd aria-hidden="true">{{ icon?.name }}</mat-icon>
                            }
                        </button>
                    }
                }
                @if (data.showCloseButton) {
                    <button mat-icon-button matSnackBarAction class="tbx-mat-notification-close-button" (click)="data.dismissByClose()" aria-label="Dismiss notification">
                        <ng-container *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: closeIcon() }"></ng-container>
                    </button>
                }
            </div>
        }
        @if (data.showCountdown && data.duration > 0) {
            <div class="tbx-mat-notification-snackbar-countdown" [style.animation-duration.ms]="data.duration"></div>
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

    /** Resolved severity icon — font ligature or SVG name. */
    readonly severityIcon = computed(() => this.resolveIcon(this.config.severityIconResolverService, this.data.type));

    /** Resolved close button icon — font ligature or SVG name. */
    readonly closeIcon = computed(() => this.resolveIcon(this.data.closeIconResolverService, 'close'));

    /** Resolved action button icon — font ligature or SVG name. */
    readonly actionIcon = computed(() => this.resolveIcon(this.data.actionIconResolverService, this.data.actionIconName));

    /**
     * Resolve an icon from a resolver service.
     * Returns the icon name and rendering mode, or `null` if the
     * resolver is absent, the key is absent, or resolution fails.
     */
    private resolveIcon(resolver: { readonly iconType: TbxMatIconType; resolve(key: string): string | undefined } | undefined, key: string | undefined): ResolvedIcon | null {
        if (!resolver || !key) {
            return null;
        }
        const name = resolver.resolve(key);
        if (!name) {
            return null;
        }
        return { name, isSvg: resolver.iconType === TbxMatIconType.Svg };
    }
}
