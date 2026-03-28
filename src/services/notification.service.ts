import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TbxSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { NotificationComponent } from '../components/notification.component';
import { type TbxMatNotificationConfigArgsType } from '../types/notification-config-args.type';
import { type TbxMatNotificationConfig } from '../models/notification-config.model';
import { type NotificationData } from '../models/notification-data.model';
import {
    NOTIFICATION_DEFAULT_DURATION_MS,
    NOTIFICATION_DEFAULT_HORIZONTAL_POSITION,
    NOTIFICATION_DEFAULT_VERTICAL_POSITION,
    NOTIFICATION_MAX_DURATION_MS,
    NOTIFICATION_MIN_DURATION_MS,
} from '../constants/notification.constants';

/**
 * Panel CSS class mapping for each notification severity level.
 *
 * These classes are applied to the MatSnackBar overlay container via
 * MatSnackBarConfig.panelClass. The corresponding styles are defined
 * in src/styles/_tbx-mat-notifications.scss — consumers must import this
 * partial into their global stylesheet (snackbar overlays render
 * outside component scope).
 */
const PANEL_CLASS_MAP: Readonly<Record<TbxSeverityLevelType, string>> = {
    [TbxSeverityLevelType.Success]: 'tbx-mat-notification-snackbar-success',
    [TbxSeverityLevelType.Error]: 'tbx-mat-notification-snackbar-error',
    [TbxSeverityLevelType.Warning]: 'tbx-mat-notification-snackbar-warning',
    [TbxSeverityLevelType.Information]: 'tbx-mat-notification-snackbar-info',
    [TbxSeverityLevelType.Help]: 'tbx-mat-notification-snackbar-help',
};

/**
 * Application-wide notification service.
 *
 * Wraps Angular Material's MatSnackBar with typed severity levels, consistent
 * positioning, configurable duration, and a custom snackbar component that
 * displays an icon + message + dismiss button.
 *
 * Notifications are queued FIFO and displayed one at a time. When the current
 * notification is dismissed (manually or by timeout), the next queued notification
 * is shown automatically. This follows Material Design guidelines — only one
 * snackbar should be visible at a time.
 *
 * Queue state is exposed via Angular signals for reactive consumption:
 * - `isActive()` — whether a notification is currently visible
 * - `pendingCount()` — number of notifications waiting in the queue
 *
 * Usage:
 * ```typescript
 * private readonly notify = inject(TbxMatNotificationService);
 *
 * this.notify.success('Item saved successfully.');
 * this.notify.error('Failed to load data. Please try again.');
 * this.notify.warn('Your session will expire in 5 minutes.');
 * this.notify.info('New version available.');
 * this.notify.help('Click the + button to add a new item.');
 * ```
 *
 * For full control over type, duration, position, and countdown:
 * ```typescript
 * this.notify.show({
 *     type: TbxSeverityLevelType.Warning,
 *     message: 'Unsaved changes will be lost.',
 *     duration: 6000,
 *     showCountdown: true,
 * });
 * ```
 *
 * Multiple notifications are queued and shown sequentially:
 * ```typescript
 * this.notify.success('Step 1 complete.');
 * this.notify.success('Step 2 complete.');
 * this.notify.success('All done!');
 * // Shows each notification in order, advancing when the previous is dismissed.
 *
 * this.notify.dismissAll(); // Clear current + all queued notifications.
 * ```
 *
 * Reactive state for templates and computed signals:
 * ```html
 * @if (notify.isActive()) {
 *     <span>Notification visible</span>
 * }
 * @if (notify.pendingCount() > 0) {
 *     <span class="badge">{{ notify.pendingCount() }}</span>
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class TbxMatNotificationService {
    private readonly snackBar = inject(MatSnackBar);

    /**
     * FIFO queue of pending notifications. When a notification is dismissed,
     * the next entry is shifted off and displayed. The queue self-drains as
     * notifications auto-dismiss on their duration timeout.
     */
    private readonly queue: TbxMatNotificationConfig[] = [];

    /**
     * Subscription to the current notification's afterDismissed() observable.
     * Tracked so dismissAll() can unsubscribe before dismissing, preventing
     * the afterDismissed callback from firing showNext() on a cleared queue.
     */
    private activeSubscription: Subscription | null = null;

    /**
     * Whether a notification is currently being displayed.
     * Reactive — usable in templates, computed(), and effect().
     */
    readonly isActive = signal(false);

    /**
     * Number of notifications waiting in the queue (not including the active one).
     * Reactive — usable in templates, computed(), and effect().
     */
    readonly pendingCount = signal(0);

    /**
     * Queue a notification for display.
     *
     * If no notification is currently visible, it displays immediately.
     * Otherwise, it is added to the FIFO queue and shown when all preceding
     * notifications have been dismissed.
     *
     * Duration is clamped to [NOTIFICATION_MIN_DURATION_MS, NOTIFICATION_MAX_DURATION_MS].
     * Defaults to NOTIFICATION_DEFAULT_DURATION_MS when omitted.
     */
    show(config: TbxMatNotificationConfig): void {
        this.queue.push(config);
        this.pendingCount.set(this.queue.length);

        if (!this.isActive()) {
            this.showNext();
        }
    }

    /**
     * Dismiss the currently visible notification.
     * If queued notifications remain, the next one is shown automatically
     * via the afterDismissed() subscription chain.
     */
    dismiss(): void {
        this.snackBar.dismiss();
    }

    /**
     * Dismiss the current notification and clear the entire queue.
     * No further queued notifications will be shown.
     *
     * Unsubscribes from the active afterDismissed() subscription before
     * dismissing to prevent the callback from firing showNext() on a
     * cleared queue.
     */
    dismissAll(): void {
        this.queue.length = 0;
        this.pendingCount.set(0);

        // Unsubscribe BEFORE dismissing — prevents afterDismissed()
        // from firing showNext() with an empty queue.
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
            this.activeSubscription = null;
        }

        this.snackBar.dismiss();
        this.isActive.set(false);
    }

    /**
     * Display a success notification.
     *
     * @param message The message to display to the user.
     * @param configArgs Optional overrides for duration, position, and countdown.
     */
    success(message: string, configArgs?: TbxMatNotificationConfigArgsType): void {
        this.show({ type: TbxSeverityLevelType.Success, message, ...configArgs });
    }

    /**
     * Display an error notification.
     *
     * @param message The message to display to the user.
     * @param configArgs Optional overrides for duration, position, and countdown.
     */
    error(message: string, configArgs?: TbxMatNotificationConfigArgsType): void {
        this.show({ type: TbxSeverityLevelType.Error, message, ...configArgs });
    }

    /**
     * Display a warning notification.
     *
     * @param message The message to display to the user.
     * @param configArgs Optional overrides for duration, position, and countdown.
     */
    warn(message: string, configArgs?: TbxMatNotificationConfigArgsType): void {
        this.show({ type: TbxSeverityLevelType.Warning, message, ...configArgs });
    }

    /**
     * Display an informational notification.
     *
     * @param message The message to display to the user.
     * @param configArgs Optional overrides for duration, position, and countdown.
     */
    info(message: string, configArgs?: TbxMatNotificationConfigArgsType): void {
        this.show({ type: TbxSeverityLevelType.Information, message, ...configArgs });
    }

    /**
     * Display a help notification.
     *
     * @param message The message to display to the user.
     * @param configArgs Optional overrides for duration, position, and countdown.
     */
    help(message: string, configArgs?: TbxMatNotificationConfigArgsType): void {
        this.show({ type: TbxSeverityLevelType.Help, message, ...configArgs });
    }

    /**
     * Shift the next notification off the queue and display it.
     * Subscribes to afterDismissed() to chain to the following notification.
     * When the queue is empty, sets isActive to false and stops.
     */
    private showNext(): void {
        const config = this.queue.shift();
        this.pendingCount.set(this.queue.length);

        if (!config) {
            this.isActive.set(false);
            return;
        }

        this.isActive.set(true);
        const duration = this.clampDuration(config.duration);

        const data: NotificationData = {
            type: config.type,
            message: config.message,
            dismiss: () => this.snackBar.dismiss(),
            duration,
            showCountdown: config.showCountdown ?? false,
        };

        const snackBarConfig: MatSnackBarConfig<NotificationData> = {
            duration,
            horizontalPosition:
                config.horizontalPosition ?? NOTIFICATION_DEFAULT_HORIZONTAL_POSITION,
            verticalPosition: config.verticalPosition ?? NOTIFICATION_DEFAULT_VERTICAL_POSITION,
            panelClass: PANEL_CLASS_MAP[config.type],
            data,
        };

        const ref = this.snackBar.openFromComponent(NotificationComponent, snackBarConfig);

        this.activeSubscription = ref.afterDismissed().subscribe(() => {
            this.activeSubscription = null;
            this.showNext();
        });
    }

    /**
     * Clamp duration to the allowed range.
     * Returns the default when undefined.
     */
    private clampDuration(duration: number | undefined): number {
        if (duration === undefined) {
            return NOTIFICATION_DEFAULT_DURATION_MS;
        }

        return Math.max(
            NOTIFICATION_MIN_DURATION_MS,
            Math.min(duration, NOTIFICATION_MAX_DURATION_MS)
        );
    }
}
