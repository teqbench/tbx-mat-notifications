import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_ICON_DEFAULT_OPTIONS, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationSeverityFontIconService } from '../services/notification-severity-font-icon.service';
import { TbxMatNotificationService } from '../services/notification.service';
import { TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';

// ─── Action Icon Resolver ─────────────────────────────────────────────────
// Inline font icon resolver for action button icons. Material Symbols
// ligatures are the icon name itself, so resolve() is an identity function.

const actionFontIconResolver = {
    iconType: TbxMatIconType.Font as const,
    resolve: (name: string) => name,
};

// ─── SVG Action Icon Resolver ─────────────────────────────────────────────
// Inline SVG icon resolver for action buttons. Icons are registered with
// MatIconRegistry in the provider factory and resolved by name.

// Bolt/lightning icon — visually distinct from any Material Symbols ligature.
// Source: Material Design Icons (Apache 2.0)
const SVG_BOLT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z"/></svg>';

const ACTION_SVG_ICON_NAME = 'action-bolt-svg';

const actionSvgIconResolver = {
    iconType: TbxMatIconType.Svg as const,
    resolve: () => ACTION_SVG_ICON_NAME,
};

// ─── Action Button Harness ──────────────────────────────────────────────────

@Component({
    selector: 'tbx-action-button-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <p class="story-description">{{ description }}</p>

            <h3>Action Button Appearances</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireTextAction()">Text</button>
                <button mat-flat-button (click)="fireTonalAction()">Tonal</button>
                <button mat-flat-button (click)="fireFilledAction()">Filled</button>
                <button mat-flat-button (click)="fireOutlinedAction()">Outlined</button>
                <button mat-flat-button (click)="fireElevatedAction()">Elevated</button>
            </div>

            <h3>Icon-Only Action Button</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireIconOnlyAction()">Font (refresh)</button>
                <button mat-flat-button (click)="fireSvgIconOnlyAction()">SVG (bolt)</button>
            </div>

            <h3>Action Button with Icon + Label</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireIconBeforeAction()">Icon Before Label</button>
                <button mat-flat-button (click)="fireIconAfterAction()">Icon After Label</button>
                <button mat-flat-button (click)="fireSvgIconBeforeAction()">SVG Icon Before Label</button>
            </div>

            <h3>Action + Close Combinations</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireActionWithClose()">Action + Close</button>
                <button mat-flat-button (click)="fireActionWithoutClose()">Action, No Close</button>
            </div>

            <h3>Countdown + Action</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireCountdownWithAction()">Countdown + Text Action</button>
            </div>

            <h3>Indefinite Duration</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireIndefinite()">Indefinite + Action</button>
            </div>

            <h3>Queue Demo</h3>
            <div class="button-group">
                <button mat-flat-button (click)="notify.dismissAll()">Dismiss All</button>
            </div>

            <p class="state">
                Active: {{ notify.isActive() }} &middot; Pending:
                {{ notify.pendingCount() }}
            </p>
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
class ActionButtonHarnessComponent {
    readonly notify = inject(TbxMatNotificationService);
    description = '';
    lastResult = '';

    private async trackResult(ref: ReturnType<TbxMatNotificationService['show']>): Promise<void> {
        const result = await ref.result;
        this.lastResult = result.dismissReason;
    }

    fireTextAction(): void {
        const ref = this.notify.success('Item deleted successfully.', {
            action: { label: 'Undo' },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireTonalAction(): void {
        const ref = this.notify.warning('Connection lost.', {
            action: { label: 'Retry', actionButtonType: 'tonal' },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireFilledAction(): void {
        const ref = this.notify.error('Upload failed.', {
            action: { label: 'Retry', actionButtonType: 'filled' },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireOutlinedAction(): void {
        const ref = this.notify.information('New version available.', {
            action: { label: 'Update', actionButtonType: 'outlined' },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireElevatedAction(): void {
        const ref = this.notify.help('Documentation updated.', {
            action: { label: 'View', actionButtonType: 'elevated' },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireIconOnlyAction(): void {
        const ref = this.notify.error('Sync failed.', {
            action: {
                label: 'Retry',
                iconName: 'refresh',
                actionButtonType: 'icon',
                actionIconResolverService: actionFontIconResolver,
            },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireIconBeforeAction(): void {
        const ref = this.notify.warning('Connection lost.', {
            action: {
                label: 'Retry',
                iconName: 'sync',
                actionButtonType: 'tonal',
                iconPosition: TbxMatNotificationIconPosition.Before,
                actionIconResolverService: actionFontIconResolver,
            },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireIconAfterAction(): void {
        const ref = this.notify.information('Report ready.', {
            action: {
                label: 'View',
                iconName: 'open_in_new',
                actionButtonType: 'outlined',
                iconPosition: TbxMatNotificationIconPosition.After,
                actionIconResolverService: actionFontIconResolver,
            },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireSvgIconOnlyAction(): void {
        const ref = this.notify.error('Sync failed.', {
            action: {
                label: 'Retry',
                iconName: ACTION_SVG_ICON_NAME,
                actionButtonType: 'icon',
                actionIconResolverService: actionSvgIconResolver,
            },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireSvgIconBeforeAction(): void {
        const ref = this.notify.warning('Connection lost.', {
            action: {
                label: 'Retry',
                iconName: ACTION_SVG_ICON_NAME,
                actionButtonType: 'tonal',
                iconPosition: TbxMatNotificationIconPosition.Before,
                actionIconResolverService: actionSvgIconResolver,
            },
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireActionWithClose(): void {
        const ref = this.notify.success('Changes saved.', {
            action: { label: 'View' },
            showCloseButton: true,
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireActionWithoutClose(): void {
        const ref = this.notify.warning('Session expiring.', {
            action: { label: 'Extend' },
            showCloseButton: false,
            duration: 30_000,
        });
        void this.trackResult(ref);
    }

    fireCountdownWithAction(): void {
        const ref = this.notify.success('Item deleted.', {
            action: { label: 'Undo' },
            showCountdown: true,
            duration: 10_000,
        });
        void this.trackResult(ref);
    }

    fireIndefinite(): void {
        const ref = this.notify.error('Critical error occurred.', {
            action: { label: 'Report' },
            duration: 0,
            showCloseButton: true,
        });
        void this.trackResult(ref);
    }
}

// ─── Providers ──────────────────────────────────────────────────────────────

/** Register the SVG action icon with MatIconRegistry. */
function registerActionSvgIcon(): void {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    registry.addSvgIconLiteral(ACTION_SVG_ICON_NAME, sanitizer.bypassSecurityTrustHtml(SVG_BOLT));
}

function withProviders() {
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

function withProviderActionDefaults() {
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

// ─── Stories ─────────────────────────────────────────────────────────────────

const meta: Meta<ActionButtonHarnessComponent> = {
    title: 'Notifications/Action Button',
    component: ActionButtonHarnessComponent,
    decorators: [moduleMetadata({ imports: [ActionButtonHarnessComponent] })],
};

export default meta;
type Story = StoryObj<ActionButtonHarnessComponent>;

export const Default: Story = {
    args: {
        description: 'Demonstrates all action button variants: appearances (text, tonal, filled, ' + 'outlined, elevated), icon-only, icon + label (before/after), action + close ' + 'combinations, countdown + action, and indefinite duration. The "Last dismiss ' + 'reason" shows the TbxMatNotificationDismissReason returned by the result promise.',
    },
    decorators: [withProviders()],
};

export const ProviderDefaults: Story = {
    name: 'Provider-Level Defaults',
    args: {
        description: 'Provider config sets application-wide action defaults: actionButtonType "tonal", ' + 'iconPosition Before, and a font icon resolver. Buttons that do not override ' + 'actionButtonType inherit tonal from the provider (e.g., the Text button renders ' + 'as tonal). Per-notification overrides still take precedence (Filled, Outlined, ' + 'Elevated). Icon buttons use the provider resolver as fallback.',
    },
    decorators: [withProviderActionDefaults()],
};
