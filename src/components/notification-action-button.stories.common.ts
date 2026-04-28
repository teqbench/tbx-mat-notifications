import { Component, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MAT_ICON_DEFAULT_OPTIONS, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationSeverityFontIconService } from '../services/notification-severity-font-icon.service';
import { TbxMatNotificationService } from '../services/notification.service';
import { TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';
import type { TbxMatNotificationActionButtonAppearance } from '../types/notification-action-button-appearance.type';
import type { TbxMatNotificationAction } from '../models/notification-action.model';
import type { Direction, IconAnimation, IconSize, Politeness } from './notification.stories.common';

// ━━━ Action Icon Resolver ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Inline font icon resolver for action button icons. Material Symbols
// ligatures are the icon name itself, so resolve() is an identity function.
export const actionFontIconResolver = {
    iconType: TbxMatIconType.Font as const,
    resolve: (name: string) => name,
};

// ━━━ SVG Action Icon Resolver ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Inline SVG icon resolver for action buttons. Icons are registered with
// MatIconRegistry in the provider factory and resolved by name.

// Bolt/lightning icon — visually distinct from any Material Symbols ligature.
// Source: Material Design Icons (Apache 2.0)
const SVG_BOLT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z"/></svg>';
export const ACTION_SVG_ICON_NAME = 'action-bolt-svg';

export const actionSvgIconResolver = {
    iconType: TbxMatIconType.Svg as const,
    resolve: () => ACTION_SVG_ICON_NAME,
};

// ━━━ Reactive CSS Injection ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ICON_SIZE_STYLE_ID = 'tbx-action-story-icon-size';
const ICON_ANIM_STYLE_ID = 'tbx-action-story-icon-animation';

const ICON_SIZE_MAP: Record<IconSize, string> = {
    standard: '',
    medium: '2rem',
    large: '3rem',
};

const STATE_TRANSITION_ANIM_CSS = `
    @keyframes tbx-action-icon-fill {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .mat-mdc-snack-bar-container .material-symbols-rounded {
        animation: tbx-action-icon-fill 0.3s ease-in-out 0.15s forwards;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

const PULSE_ANIM_CSS = `
    @keyframes tbx-action-icon-pulse {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .mat-mdc-snack-bar-container .material-symbols-rounded {
        animation: tbx-action-icon-pulse 1s ease-in-out infinite alternate;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

const HOVER_FILL_ANIM_CSS = `
    .mat-mdc-snack-bar-container .material-symbols-rounded {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        transition: font-variation-settings 0.3s ease-in-out;
    }
    .mat-mdc-snack-bar-container .material-symbols-rounded:hover {
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

// ━━━ Action Button Harness ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@Component({
    selector: 'tbx-action-button-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <p class="story-description">{{ description() }}</p>

            <h3>Action Button Appearances</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('text')">Text</button>
                <button mat-flat-button (click)="fire('tonal')">Tonal</button>
                <button mat-flat-button (click)="fire('filled')">Filled</button>
                <button mat-flat-button (click)="fire('outlined')">Outlined</button>
                <button mat-flat-button (click)="fire('elevated')">Elevated</button>
            </div>

            <h3>Icon-Only Action Button</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireIconOnly('font')">Font (refresh)</button>
                <button mat-flat-button (click)="fireIconOnly('svg')">SVG (bolt)</button>
            </div>

            <h3>Action Button with Icon + Label</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireWithIcon('font')">Font Icon</button>
                <button mat-flat-button (click)="fireWithIcon('svg')">SVG Icon</button>
            </div>

            <h3>Queue</h3>
            <div class="button-group">
                <button mat-flat-button (click)="notify.dismissAll()">Dismiss All</button>
            </div>

            <p class="state">Active: {{ notify.isActive() }} &middot; Pending: {{ notify.pendingCount() }}</p>
            @if (lastResult) {
                <p class="state">Last dismiss reason: {{ lastResult }}</p>
            }
        </div>
    `,
    styles: `
        .harness {
            font-family: Roboto, sans-serif;
            padding: 1.5rem;
        }
        h3 {
            margin: 1.5rem 0 0.5rem;
        }
        h3:first-child {
            margin-top: 0;
        }
        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .state {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #666;
        }
        .story-description {
            font-size: 0.875rem;
            color: #333;
            background: #f0f4ff;
            border-left: 3px solid #1565c0;
            padding: 0.5rem 0.75rem;
            margin: 0 0 1rem;
            line-height: 1.4;
        }
    `,
})
export class ActionButtonHarnessComponent {
    readonly notify = inject(TbxMatNotificationService);
    readonly description = input<string>('');
    readonly severity = input<'default' | 'success' | 'error' | 'warning' | 'information' | 'help'>('success');
    readonly actionLabel = input<string>('Undo');
    readonly fontIconName = input<string>('refresh');
    readonly iconPosition = input<TbxMatNotificationIconPosition>(TbxMatNotificationIconPosition.Before);
    readonly showSeverityIcon = input<boolean>(true);
    readonly showCloseButton = input<boolean>(true);
    readonly showCountdown = input<boolean>(false);
    readonly duration = input<number>(30000);
    readonly horizontalPosition = input<MatSnackBarHorizontalPosition>('start');
    readonly verticalPosition = input<MatSnackBarVerticalPosition>('bottom');
    readonly iconSize = input<IconSize>('standard');
    readonly iconAnimation = input<IconAnimation>('none');
    readonly politeness = input<Politeness>('polite');
    readonly direction = input<Direction>('ltr');

    lastResult = '';

    private readonly messages: Record<string, string> = {
        default: 'A neutral, non-severity message.',
        success: 'Item deleted successfully.',
        error: 'Upload failed.',
        warning: 'Connection lost.',
        information: 'New version available.',
        help: 'Documentation updated.',
    };

    constructor() {
        effect(() => {
            const size = ICON_SIZE_MAP[this.iconSize()];
            document.getElementById(ICON_SIZE_STYLE_ID)?.remove();
            if (!size) return;
            const style = document.createElement('style');
            style.id = ICON_SIZE_STYLE_ID;
            style.textContent = `html { --tbx-mat-notification-icon-size: ${size}; }`;
            document.head.appendChild(style);
        });

        effect(() => {
            const mode = this.iconAnimation();
            document.getElementById(ICON_ANIM_STYLE_ID)?.remove();
            if (mode === 'none') return;
            const css = mode === 'state-transition' ? STATE_TRANSITION_ANIM_CSS : mode === 'pulse' ? PULSE_ANIM_CSS : HOVER_FILL_ANIM_CSS;
            const style = document.createElement('style');
            style.id = ICON_ANIM_STYLE_ID;
            style.textContent = css;
            document.head.appendChild(style);
        });
    }

    fire(buttonType: TbxMatNotificationActionButtonAppearance): void {
        const action: TbxMatNotificationAction = {
            label: this.actionLabel(),
            actionButtonType: buttonType,
        };
        this.dispatch(action);
    }

    fireIconOnly(resolver: 'font' | 'svg'): void {
        const action: TbxMatNotificationAction = {
            label: this.actionLabel(),
            iconName: resolver === 'font' ? this.fontIconName() : ACTION_SVG_ICON_NAME,
            actionButtonType: 'icon',
            actionIconResolverService: resolver === 'font' ? actionFontIconResolver : actionSvgIconResolver,
        };
        this.dispatch(action);
    }

    fireWithIcon(resolver: 'font' | 'svg'): void {
        const action: TbxMatNotificationAction = {
            label: this.actionLabel(),
            iconName: resolver === 'font' ? this.fontIconName() : ACTION_SVG_ICON_NAME,
            actionButtonType: 'tonal',
            iconPosition: this.iconPosition(),
            actionIconResolverService: resolver === 'font' ? actionFontIconResolver : actionSvgIconResolver,
        };
        this.dispatch(action);
    }

    private dispatch(action: TbxMatNotificationAction): void {
        const level = this.severity();
        const method = this.notify[level as keyof TbxMatNotificationService] as (msg: string, args?: object) => ReturnType<TbxMatNotificationService['show']>;
        const ref = method.call(this.notify, this.messages[level], {
            action,
            duration: this.duration(),
            showCountdown: this.showCountdown(),
            showSeverityIcon: this.showSeverityIcon(),
            showCloseButton: this.showCloseButton(),
            snackBarConfig: {
                horizontalPosition: this.horizontalPosition(),
                verticalPosition: this.verticalPosition(),
                politeness: this.politeness(),
                direction: this.direction(),
            },
        });
        void this.trackResult(ref);
    }

    private async trackResult(ref: ReturnType<TbxMatNotificationService['show']>): Promise<void> {
        const result = await ref.result;
        this.lastResult = result.dismissReason;
    }
}

// ━━━ Severity Matrix Harness ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@Component({
    selector: 'tbx-severity-matrix-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <p class="story-description">{{ description() }}</p>

            <div class="matrix">
                @for (severity of severities; track severity.key) {
                    <div class="severity-row">
                        <h3 class="severity-label" [style.border-left-color]="severity.color">
                            {{ severity.label }}
                        </h3>
                        <div class="button-group">
                            <button mat-flat-button (click)="fire(severity.key, 'text')">Text</button>
                            <button mat-flat-button (click)="fire(severity.key, 'filled')">Filled</button>
                            <button mat-flat-button (click)="fire(severity.key, 'tonal')">Tonal</button>
                            <button mat-flat-button (click)="fire(severity.key, 'outlined')">Outlined</button>
                            <button mat-flat-button (click)="fire(severity.key, 'elevated')">Elevated</button>
                            <button mat-flat-button (click)="fire(severity.key, 'icon')">Icon</button>
                        </div>
                    </div>
                }
            </div>

            <h3>Fire All for One Severity</h3>
            <div class="button-group">
                @for (severity of severities; track severity.key) {
                    <button mat-flat-button (click)="fireAll(severity.key)">All {{ severity.label }}</button>
                }
            </div>

            <h3>Queue</h3>
            <div class="button-group">
                <button mat-flat-button (click)="notify.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">Active: {{ notify.isActive() }} &middot; Pending: {{ notify.pendingCount() }}</p>
            @if (lastResult) {
                <p class="state">Last dismiss reason: {{ lastResult }}</p>
            }
        </div>
    `,
    styles: `
        .harness {
            font-family: Roboto, sans-serif;
            padding: 1.5rem;
        }
        .matrix {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .severity-row {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }
        .severity-label {
            margin: 0;
            font-size: 0.875rem;
            font-weight: 500;
            padding-left: 0.5rem;
            border-left: 3px solid #999;
        }
        h3 {
            margin: 1.5rem 0 0.5rem;
        }
        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .state {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #666;
        }
        .story-description {
            font-size: 0.875rem;
            color: #333;
            background: #f0f4ff;
            border-left: 3px solid #1565c0;
            padding: 0.5rem 0.75rem;
            margin: 0 0 1rem;
            line-height: 1.4;
        }
    `,
})
export class SeverityMatrixHarnessComponent {
    readonly notify = inject(TbxMatNotificationService);
    readonly description = input<string>('');
    readonly fontIconName = input<string>('refresh');
    readonly iconPosition = input<TbxMatNotificationIconPosition>(TbxMatNotificationIconPosition.Before);
    readonly showSeverityIcon = input<boolean>(true);
    readonly showCloseButton = input<boolean>(true);
    readonly showCountdown = input<boolean>(false);
    readonly duration = input<number>(0);
    readonly horizontalPosition = input<MatSnackBarHorizontalPosition>('start');
    readonly verticalPosition = input<MatSnackBarVerticalPosition>('bottom');
    readonly iconSize = input<IconSize>('standard');
    readonly iconAnimation = input<IconAnimation>('none');
    readonly politeness = input<Politeness>('polite');
    readonly direction = input<Direction>('ltr');

    lastResult = '';

    readonly severities = [
        { key: 'default', label: 'Default', color: '#757575' },
        { key: 'success', label: 'Success', color: '#2e7d32' },
        { key: 'error', label: 'Error', color: '#c62828' },
        { key: 'warning', label: 'Warning', color: '#f9a825' },
        { key: 'information', label: 'Information', color: '#1565c0' },
        { key: 'help', label: 'Help', color: '#1976d2' },
    ];

    private readonly messages: Record<string, string> = {
        default: 'This is a default notification.',
        success: 'Operation completed successfully.',
        error: 'Something went wrong. Please try again.',
        warning: 'Your session will expire in 5 minutes.',
        information: 'A new version is available.',
        help: 'Click the + button to add a new item.',
    };

    private readonly actionLabels: Record<string, string> = {
        text: 'Undo',
        filled: 'Retry',
        tonal: 'Retry',
        outlined: 'Update',
        elevated: 'View',
        icon: 'Retry',
    };

    constructor() {
        effect(() => {
            const size = ICON_SIZE_MAP[this.iconSize()];
            document.getElementById(ICON_SIZE_STYLE_ID)?.remove();
            if (!size) return;
            const style = document.createElement('style');
            style.id = ICON_SIZE_STYLE_ID;
            style.textContent = `html { --tbx-mat-notification-icon-size: ${size}; }`;
            document.head.appendChild(style);
        });

        effect(() => {
            const mode = this.iconAnimation();
            document.getElementById(ICON_ANIM_STYLE_ID)?.remove();
            if (mode === 'none') return;
            const css = mode === 'state-transition' ? STATE_TRANSITION_ANIM_CSS : mode === 'pulse' ? PULSE_ANIM_CSS : HOVER_FILL_ANIM_CSS;
            const style = document.createElement('style');
            style.id = ICON_ANIM_STYLE_ID;
            style.textContent = css;
            document.head.appendChild(style);
        });
    }

    fire(severityKey: string, buttonType: TbxMatNotificationActionButtonAppearance): void {
        const method = this.notify[severityKey as keyof TbxMatNotificationService] as (msg: string, args?: object) => ReturnType<TbxMatNotificationService['show']>;

        const action: TbxMatNotificationAction = {
            label: this.actionLabels[buttonType],
            actionButtonType: buttonType,
            ...(buttonType === 'icon'
                ? {
                      iconName: this.fontIconName(),
                      actionIconResolverService: actionFontIconResolver,
                  }
                : {}),
            ...(buttonType !== 'icon' && buttonType !== 'text' ? { iconPosition: this.iconPosition() } : {}),
        };

        const ref = method.call(this.notify, this.messages[severityKey], {
            action,
            duration: this.duration(),
            showCountdown: this.showCountdown(),
            showSeverityIcon: this.showSeverityIcon(),
            showCloseButton: this.showCloseButton(),
            snackBarConfig: {
                horizontalPosition: this.horizontalPosition(),
                verticalPosition: this.verticalPosition(),
                politeness: this.politeness(),
                direction: this.direction(),
            },
        });

        void this.trackResult(ref);
    }

    fireAll(severityKey: string): void {
        const types: TbxMatNotificationActionButtonAppearance[] = ['text', 'filled', 'tonal', 'outlined', 'elevated', 'icon'];
        for (const type of types) {
            this.fire(severityKey, type);
        }
    }

    private async trackResult(ref: ReturnType<TbxMatNotificationService['show']>): Promise<void> {
        const result = await ref.result;
        this.lastResult = result.dismissReason;
    }
}

// ━━━ Providers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Register the SVG action icon with MatIconRegistry. */
export function registerActionSvgIcon(): void {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    registry.addSvgIconLiteral(ACTION_SVG_ICON_NAME, sanitizer.bypassSecurityTrustHtml(SVG_BOLT));
}

export function withActionProviders() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => {
                    registerActionSvgIcon();
                    return {
                        severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                    };
                },
            },
        ],
    });
}

export function withActionProviderDefaults() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => {
                    registerActionSvgIcon();
                    return {
                        severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                        actionConfig: {
                            actionButtonType: 'tonal' as const,
                            iconPosition: TbxMatNotificationIconPosition.Before,
                            actionIconResolverService: actionFontIconResolver,
                        },
                    };
                },
            },
        ],
    });
}

// ━━━ Arg Types & Defaults ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ACTION_BUTTON_ARG_TYPES = {
    severity: {
        control: 'select',
        options: ['default', 'success', 'error', 'warning', 'information', 'help'],
        description: 'Severity level used by the trigger buttons',
    },
    actionLabel: {
        control: 'text',
        description: 'Label for the action button (also used as aria-label for icon-only)',
    },
    fontIconName: {
        control: 'text',
        description: 'Material Symbols ligature for font-icon action variants',
    },
    iconPosition: {
        control: 'inline-radio',
        options: [TbxMatNotificationIconPosition.Before, TbxMatNotificationIconPosition.After],
        description: 'Position of the action icon relative to the label',
    },
    showSeverityIcon: { control: 'boolean', description: 'Show the severity icon' },
    showCloseButton: { control: 'boolean', description: 'Show the close button' },
    showCountdown: { control: 'boolean', description: 'Show the countdown bar' },
    duration: {
        control: { type: 'number', min: 0, step: 500 },
        description: 'Duration in ms (0 = indefinite)',
    },
    horizontalPosition: {
        control: 'select',
        options: ['start', 'center', 'end', 'left', 'right'],
        description: 'Snackbar horizontal position',
    },
    verticalPosition: {
        control: 'select',
        options: ['top', 'bottom'],
        description: 'Snackbar vertical position',
    },
    iconSize: {
        control: 'select',
        options: ['standard', 'medium', 'large'],
        description: 'Severity icon size',
    },
    iconAnimation: {
        control: 'select',
        options: ['none', 'state-transition', 'pulse', 'hover-fill'],
        description: 'Severity icon animation mode',
    },
    politeness: {
        control: 'select',
        options: ['off', 'polite', 'assertive'],
        description: 'aria-live politeness',
    },
    direction: {
        control: 'inline-radio',
        options: ['ltr', 'rtl'],
        description: 'Layout direction',
    },
} as const;

export const SEVERITY_MATRIX_ARG_TYPES = {
    fontIconName: ACTION_BUTTON_ARG_TYPES.fontIconName,
    iconPosition: ACTION_BUTTON_ARG_TYPES.iconPosition,
    showSeverityIcon: ACTION_BUTTON_ARG_TYPES.showSeverityIcon,
    showCloseButton: ACTION_BUTTON_ARG_TYPES.showCloseButton,
    showCountdown: ACTION_BUTTON_ARG_TYPES.showCountdown,
    duration: ACTION_BUTTON_ARG_TYPES.duration,
    horizontalPosition: ACTION_BUTTON_ARG_TYPES.horizontalPosition,
    verticalPosition: ACTION_BUTTON_ARG_TYPES.verticalPosition,
    iconSize: ACTION_BUTTON_ARG_TYPES.iconSize,
    iconAnimation: ACTION_BUTTON_ARG_TYPES.iconAnimation,
    politeness: ACTION_BUTTON_ARG_TYPES.politeness,
    direction: ACTION_BUTTON_ARG_TYPES.direction,
} as const;

export const DEFAULT_ACTION_ARGS = {
    severity: 'success' as const,
    actionLabel: 'Undo',
    fontIconName: 'refresh',
    iconPosition: TbxMatNotificationIconPosition.Before,
    showSeverityIcon: true,
    showCloseButton: true,
    showCountdown: false,
    duration: 30000,
    horizontalPosition: 'start' as MatSnackBarHorizontalPosition,
    verticalPosition: 'bottom' as MatSnackBarVerticalPosition,
    iconSize: 'standard' as IconSize,
    iconAnimation: 'none' as IconAnimation,
    politeness: 'polite' as Politeness,
    direction: 'ltr' as Direction,
};

export type SeverityMatrixArgs = {
    description: string;
    fontIconName: string;
    iconPosition: TbxMatNotificationIconPosition;
    showSeverityIcon: boolean;
    showCloseButton: boolean;
    showCountdown: boolean;
    duration: number;
    horizontalPosition: MatSnackBarHorizontalPosition;
    verticalPosition: MatSnackBarVerticalPosition;
    iconSize: IconSize;
    iconAnimation: IconAnimation;
    politeness: Politeness;
    direction: Direction;
};

export const DEFAULT_MATRIX_ARGS: SeverityMatrixArgs = {
    description: 'Matrix view: fire any combination of severity level × action button type. Default duration is 0 (indefinite) so you can inspect styling at rest — change it via the Controls panel. Hover over action buttons to verify state-layer behavior. Use "Dismiss All" to clear the queue between tests.',
    fontIconName: 'refresh',
    iconPosition: TbxMatNotificationIconPosition.Before,
    showSeverityIcon: true,
    showCloseButton: true,
    showCountdown: false,
    duration: 0,
    horizontalPosition: 'start',
    verticalPosition: 'bottom',
    iconSize: 'standard',
    iconAnimation: 'none',
    politeness: 'polite',
    direction: 'ltr',
};
