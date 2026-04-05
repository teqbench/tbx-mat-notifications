import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationSeverityFontIconService } from '../services/notification-severity-font-icon.service';
import { TbxMatNotificationService } from '../services/notification.service';

// ─── Action Button Harness ──────────────────────────────────────────────────

@Component({
    selector: 'tbx-action-button-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <p class="story-description">{{ description }}</p>

            <h3>Action Button Variants</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireTextAction()">Text Action</button>
                <button mat-flat-button (click)="fireTonalAction()">Tonal Action</button>
                <button mat-flat-button (click)="fireFilledAction()">Filled Action</button>
                <button mat-flat-button (click)="fireOutlinedAction()">Outlined Action</button>
            </div>

            <h3>Action + Close Combinations</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fireActionWithClose()">Action + Close</button>
                <button mat-flat-button (click)="fireActionWithoutClose()">Action, No Close</button>
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

    fireIndefinite(): void {
        const ref = this.notify.error('Critical error occurred.', {
            action: { label: 'Report' },
            duration: 0,
            showCloseButton: true,
        });
        void this.trackResult(ref);
    }
}

// ─── Stories ─────────────────────────────────────────────────────────────────

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
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                }),
            },
        ],
    });
}

const meta: Meta<ActionButtonHarnessComponent> = {
    title: 'Notifications/Action Button',
    component: ActionButtonHarnessComponent,
    decorators: [moduleMetadata({ imports: [ActionButtonHarnessComponent] }), withProviders()],
};

export default meta;
type Story = StoryObj<ActionButtonHarnessComponent>;

export const Default: Story = {
    args: {
        description:
            'Demonstrates action button variants (text, tonal, filled, outlined), ' +
            'action + close combinations, and indefinite duration with action. ' +
            'The "Last dismiss reason" shows the TbxMatNotificationDismissReason ' +
            'returned by the result promise.',
    },
};
