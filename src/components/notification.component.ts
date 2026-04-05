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
 * A shared `ng-template` (`#tbxNgIconTemplate`) handles the font vs SVG
 * branching for all icon sites. Each call site passes a `ResolvedIcon`
 * via `ngTemplateOutlet` context. The template guards against `null`
 * internally, so call sites do not need their own null checks.
 *
 * ### Content projection and `ngProjectAs`
 *
 * {@link https://material.angular.dev/components/button/api | Angular Material}'s
 * button component uses `ng-content select` to project `mat-icon` elements
 * into leading and trailing slots:
 * - `mat-icon:not([iconPositionEnd])` — leading slot (before the label)
 * - `mat-icon[iconPositionEnd]` — trailing slot (after the label)
 *
 * When `mat-icon` is rendered via `ngTemplateOutlet` inside an
 * `ng-container`, {@link https://angular.dev | Angular}'s projection
 * matching sees `ng-container` — not `mat-icon` — as the direct child
 * of the button. The icon falls into the default `<ng-content>` slot
 * (`.mdc-button__label`) instead of the icon slot, breaking alignment.
 *
 * The `ngProjectAs` attribute on `ng-container` solves this. It tells
 * Angular's projection matching (`isSelectorInSelectorList` in the
 * runtime) to treat the `ng-container` as if it were the specified
 * selector. The match is **exact** — the parsed `ngProjectAs` value
 * must match the parsed `ng-content select` value element-by-element:
 * - `ngProjectAs="mat-icon:not([iconPositionEnd])"` — matches the
 *   leading slot selector exactly
 * - `ngProjectAs="mat-icon[iconPositionEnd]"` — matches the trailing
 *   slot selector exactly
 *
 * A plain `ngProjectAs="mat-icon"` does NOT match the leading slot
 * because the slot selector is `mat-icon:not([iconPositionEnd])` —
 * the parsed arrays have different lengths and `isSelectorInSelectorList`
 * requires exact element-by-element equality.
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
                        <!-- Labeled action button with optional leading/trailing icon.
                             ngProjectAs on ng-container tells Angular's content
                             projection to match the exact button slot selector:
                             - "mat-icon:not([iconPositionEnd])" for leading
                             - "mat-icon[iconPositionEnd]" for trailing
                             The shared tbxNgIconTemplate guards against null
                             icon internally, so the position check alone is
                             sufficient here. -->
                        @let icon = actionIcon();
                        <button matSnackBarAction class="tbx-mat-notification-action-button" [matButton]="data.actionButtonType ?? 'text'" (click)="data.dismissByAction()">
                            @if (data.actionIconPosition === 'before') {
                                <ng-container ngProjectAs="mat-icon:not([iconPositionEnd])" *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: icon }"></ng-container>
                            }

                            {{ data.actionLabel }}

                            @if (data.actionIconPosition === 'after') {
                                <ng-container ngProjectAs="mat-icon[iconPositionEnd]" *ngTemplateOutlet="tbxNgIconTemplate; context: { icon: icon }"></ng-container>
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
