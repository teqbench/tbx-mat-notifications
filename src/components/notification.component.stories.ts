import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatNotificationService } from '../services/notification.service';

/**
 * Wrapper component that exposes buttons to trigger notifications.
 * Notifications render in the CDK overlay (outside the component tree),
 * so we trigger them programmatically via TbxMatNotificationService.
 */
@Component({
    selector: 'tbx-notification-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <p class="theme-note">
                Theme: Angular Material prebuilt <strong>Azure Blue</strong>. Notification severity
                colors are independent of the M3 theme palette.
            </p>
            <h3>Notification Triggers</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('success')">Success</button>
                <button mat-flat-button (click)="fire('error')">Error</button>
                <button mat-flat-button (click)="fire('warn')">Warning</button>
                <button mat-flat-button (click)="fire('info')">Info</button>
                <button mat-flat-button (click)="fire('help')">Help</button>
            </div>

            <h3>With Countdown</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('success', true)">Success</button>
                <button mat-flat-button (click)="fire('error', true)">Error</button>
                <button mat-flat-button (click)="fire('warn', true)">Warning</button>
                <button mat-flat-button (click)="fire('info', true)">Info</button>
                <button mat-flat-button (click)="fire('help', true)">Help</button>
            </div>

            <h3>Queue Demo</h3>
            <div class="button-group">
                <button mat-flat-button (click)="queueDemo()">Fire 3 Queued</button>
                <button mat-flat-button (click)="notify.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">
                Active: {{ notify.isActive() }} &middot; Pending: {{ notify.pendingCount() }}
            </p>
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

        .theme-note {
            font-size: 0.8125rem;
            color: #888;
            border-left: 3px solid #ddd;
            padding: 0.25rem 0.75rem;
            margin: 0 0 1rem;
        }

        .state {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #666;
        }
    `,
})
class NotificationHarnessComponent {
    readonly notify = inject(TbxMatNotificationService);
    readonly horizontalPosition = input<MatSnackBarHorizontalPosition>('start');
    readonly verticalPosition = input<MatSnackBarVerticalPosition>('bottom');

    private readonly messages: Record<string, string> = {
        success: 'Operation completed successfully.',
        error: 'Something went wrong. Please try again.',
        warn: 'Your session will expire in 5 minutes.',
        info: 'A new version is available.',
        help: 'Click the + button to add a new item.',
    };

    fire(level: string, showCountdown = false): void {
        const method = this.notify[level as keyof TbxMatNotificationService] as (
            msg: string,
            args?: object
        ) => void;
        method.call(this.notify, this.messages[level], {
            showCountdown,
            horizontalPosition: this.horizontalPosition(),
            verticalPosition: this.verticalPosition(),
        });
    }

    queueDemo(): void {
        this.notify.success('Step 1: Complete.', {
            showCountdown: true,
            horizontalPosition: this.horizontalPosition(),
            verticalPosition: this.verticalPosition(),
        });
        this.notify.warn('Step 2: Review needed.', {
            showCountdown: true,
            horizontalPosition: this.horizontalPosition(),
            verticalPosition: this.verticalPosition(),
        });
        this.notify.info('Step 3: All done.', {
            showCountdown: true,
            horizontalPosition: this.horizontalPosition(),
            verticalPosition: this.verticalPosition(),
        });
    }
}

const STYLE_TAG_ID = 'tbx-notification-story-overrides';

/**
 * Storybook decorator that injects CSS custom property overrides into
 * the document head. Each story replaces the previous overrides so
 * switching stories doesn't leak styles.
 */
function withCustomProperties(css: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (story: () => any) => {
        document.getElementById(STYLE_TAG_ID)?.remove();
        if (css) {
            const style = document.createElement('style');
            style.id = STYLE_TAG_ID;
            style.textContent = css;
            document.head.appendChild(style);
        }
        return story();
    };
}

/** Decorator that clears any custom property overrides from a previous story. */
function withDefaultProperties() {
    return withCustomProperties('');
}

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications',
    component: NotificationHarnessComponent,
    decorators: [
        moduleMetadata({
            imports: [NotificationHarnessComponent],
        }),
    ],
    argTypes: {
        horizontalPosition: {
            control: 'select',
            options: ['start', 'center', 'end', 'left', 'right'],
            description: 'Horizontal position of the snackbar',
        },
        verticalPosition: {
            control: 'select',
            options: ['top', 'bottom'],
            description: 'Vertical position of the snackbar',
        },
    },
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

export const Default: Story = {
    args: {
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
    },
    decorators: [withDefaultProperties()],
};

export const TopCenter: Story = {
    args: {
        horizontalPosition: 'center',
        verticalPosition: 'top',
    },
    decorators: [withDefaultProperties()],
};

export const TopEnd: Story = {
    args: {
        horizontalPosition: 'end',
        verticalPosition: 'top',
    },
    decorators: [withDefaultProperties()],
};

export const BottomCenter: Story = {
    args: {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
    },
    decorators: [withDefaultProperties()],
};

export const BottomEnd: Story = {
    args: {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
    },
    decorators: [withDefaultProperties()],
};

export const CompactSizing: Story = {
    args: {
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
    },
    decorators: [
        withCustomProperties(`
            html {
                --tbx-mat-notification-icon-size: 1.125rem;
                --tbx-mat-notification-font-size: 0.8125rem;
                --tbx-mat-notification-padding: 0.125rem;
                --tbx-mat-notification-label-gap: 0.5rem;
                --tbx-mat-notification-actions-padding: 0.5rem;
                --tbx-mat-notification-countdown-height: 0.125rem;
            }
        `),
    ],
};

export const LargeSizing: Story = {
    args: {
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
    },
    decorators: [
        withCustomProperties(`
            html {
                --tbx-mat-notification-icon-size: 3rem;
                --tbx-mat-notification-font-size: 2rem;
                --tbx-mat-notification-padding: 0.5rem;
                --tbx-mat-notification-label-gap: 2rem;
                --tbx-mat-notification-countdown-height: 0.25rem;
            }
        `),
    ],
};

export const LargeIconOnly: Story = {
    args: {
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
    },
    decorators: [
        withCustomProperties(`
            html {
                --tbx-mat-notification-icon-size: 3rem;
            }
        `),
    ],
};
