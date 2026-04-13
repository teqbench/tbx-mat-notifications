import { Component, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TbxMatNotificationService } from '../../index';

type IconSize = 'standard' | 'medium' | 'large';
type IconAnimation = 'none' | 'state-transition' | 'pulse';

@Component({
    selector: 'tbx-notification-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            <div class="instructions">
                <p><strong>Notifications</strong> are transient, lightweight messages displayed via Angular Material's snackbar. The lifecycle is managed by <code>TbxMatNotificationService</code>: call <code>notify.success(&hellip;)</code>, <code>notify.error(&hellip;)</code>, etc. and the service creates the snackbar, queues it if another is already visible, and resolves a promise when dismissed.</p>
                <p>
                    By default notifications auto-dismiss after 10 seconds with a visible countdown bar. Pass
                    <code>&#123; duration: 0 &#125;</code> to make them indefinite (closed only by the action button, close button, or programmatic dismiss).
                </p>
                <p>Use the <strong>Controls</strong> panel below to try:</p>
                <ul>
                    <li><strong>Show Severity Icon</strong> / <strong>Show Close Button</strong> — toggles the two optional UI elements</li>
                    <li><strong>Show Countdown</strong> — displays the CSS-driven countdown bar</li>
                    <li><strong>Icon Size</strong> — standard / medium / large severity icon</li>
                    <li><strong>Icon Animation</strong> — none, state-transition (fill-in on enter), or pulse</li>
                </ul>
            </div>

            <h3>Severity Levels</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('default')">Default</button>
                <button mat-flat-button (click)="fire('success')">Success</button>
                <button mat-flat-button (click)="fire('error')">Error</button>
                <button mat-flat-button (click)="fire('warning')">Warning</button>
                <button mat-flat-button (click)="fire('information')">Information</button>
                <button mat-flat-button (click)="fire('help')">Help</button>
            </div>

            <h3>Queue Demo</h3>
            <p class="theme-note">Notifications display in FIFO order — fire a queue of six and they appear one after another. Auto-dismiss advances to the next.</p>
            <div class="button-group">
                <button mat-flat-button (click)="queueAll()">Fire 6 Queued</button>
                <button mat-flat-button (click)="notify.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">Active: {{ notify.isActive() }} &middot; Pending: {{ notify.pendingCount() }}</p>
        </div>
    `,
    styles: [
        `
            .harness {
                font-family: Roboto, sans-serif;
                padding: 1.5rem;
            }
            h3 {
                margin: 1.5rem 0 0.5rem;
            }
            h3:first-of-type {
                margin-top: 0;
            }
            .instructions {
                font-size: 0.875rem;
                color: #555;
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 0.75rem 1rem;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            .instructions p {
                margin: 0 0 0.5rem;
            }
            .instructions p:last-child,
            .instructions ul:last-child {
                margin-bottom: 0;
            }
            .instructions ul {
                margin: 0;
                padding-left: 1.25rem;
            }
            .instructions li {
                margin-bottom: 0.125rem;
            }
            .instructions code {
                background: #eef2ff;
                color: #4338ca;
                padding: 0.1em 0.35em;
                border-radius: 3px;
                font-size: 0.9em;
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
            .theme-note {
                font-size: 0.8125rem;
                color: #888;
                border-left: 3px solid #ddd;
                padding: 0.25rem 0.75rem;
                margin: 0 0 1rem;
            }
        `,
    ],
})
class NotificationHarnessComponent {
    readonly notify = inject(TbxMatNotificationService);

    readonly showSeverityIcon = input<boolean>(true);
    readonly showCloseButton = input<boolean>(true);
    readonly showCountdown = input<boolean>(true);
    readonly iconSize = input<IconSize>('standard');
    readonly iconAnimation = input<IconAnimation>('none');

    private readonly messages: Record<string, string> = {
        default: 'This is a default notification with no severity styling.',
        success: 'Operation completed successfully.',
        error: 'Something went wrong. Please try again.',
        warning: 'Your session will expire in 5 minutes.',
        information: 'A new version is available.',
        help: 'Click the + button to add a new item.',
    };

    constructor() {
        // Inject icon size CSS custom property at the document level so it
        // reaches notifications (which render inside the Material snackbar
        // overlay, outside the component tree).
        const SIZE_STYLE_ID = 'tbx-notification-story-icon-size';
        const SIZE_MAP: Record<IconSize, string> = {
            standard: '',
            medium: '2rem',
            large: '3rem',
        };

        effect(() => {
            const size = SIZE_MAP[this.iconSize()];
            document.getElementById(SIZE_STYLE_ID)?.remove();
            if (!size) return;
            const style = document.createElement('style');
            style.id = SIZE_STYLE_ID;
            style.textContent = `html { --tbx-mat-notification-icon-size: ${size}; }`;
            document.head.appendChild(style);
        });

        // Inject icon animation CSS at document level. Selectors target the
        // Material snackbar container because notifications render inside
        // `.mat-mdc-snack-bar-container` via the snackbar overlay — any
        // component-scoped CSS in this harness wouldn't reach that DOM.
        const ANIM_STYLE_ID = 'tbx-notification-story-icon-animation';

        const STATE_CSS = `
      @keyframes tbx-notification-icon-fill {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      }
      .mat-mdc-snack-bar-container .material-symbols-rounded {
        animation: tbx-notification-icon-fill 0.3s ease-in-out 0.15s forwards;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
    `;

        const PULSE_CSS = `
      @keyframes tbx-notification-icon-pulse {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      }
      .mat-mdc-snack-bar-container .tbx-mat-notification-snackbar-icon {
        animation: tbx-notification-icon-pulse 1s ease-in-out infinite alternate;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
    `;

        effect(() => {
            const mode = this.iconAnimation();
            document.getElementById(ANIM_STYLE_ID)?.remove();
            if (mode === 'none') return;
            const style = document.createElement('style');
            style.id = ANIM_STYLE_ID;
            style.textContent = mode === 'state-transition' ? STATE_CSS : PULSE_CSS;
            document.head.appendChild(style);
        });
    }

    fire(level: string): void {
        const method = this.notify[level as keyof TbxMatNotificationService] as (msg: string, args?: object) => void;
        method.call(this.notify, this.messages[level], this.args());
    }

    queueAll(): void {
        const args = this.args();
        this.notify.default('Step 1: This is a default notification.', args);
        this.notify.success('Step 2: Operation completed successfully.', args);
        this.notify.error('Step 3: Something went wrong.', args);
        this.notify.warning('Step 4: Review needed.', args);
        this.notify.information('Step 5: A new version is available.', args);
        this.notify.help('Step 6: Click the + button to add a new item.', args);
    }

    private args(): object {
        return {
            showSeverityIcon: this.showSeverityIcon(),
            showCloseButton: this.showCloseButton(),
            showCountdown: this.showCountdown(),
        };
    }
}

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications',
    tags: ['notifications'],
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: {
        showSeverityIcon: {
            name: 'Show Severity Icon',
            control: 'boolean',
            description: 'Display the severity icon on the left of the message',
        },
        showCloseButton: {
            name: 'Show Close Button',
            control: 'boolean',
            description: 'Display the close (×) button on the right',
        },
        showCountdown: {
            name: 'Show Countdown',
            control: 'boolean',
            description: 'Display the CSS-driven countdown bar along the bottom edge',
        },
        iconSize: {
            name: 'Icon Size',
            control: 'select',
            options: ['standard', 'medium', 'large'],
            description: 'Severity icon size',
        },
        iconAnimation: {
            name: 'Icon Animation',
            control: 'select',
            options: ['none', 'state-transition', 'pulse'],
            description: 'Icon fill animation',
        },
    },
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

export const Notifications: Story = {
    args: {
        showSeverityIcon: true,
        showCloseButton: true,
        showCountdown: true,
        iconSize: 'standard',
        iconAnimation: 'none',
    },
};
