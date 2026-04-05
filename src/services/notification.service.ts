import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatNotificationComponent } from '../components/notification.component';
import { type TbxMatNotificationConfigArgs } from '../types/notification-config-args.type';
import { type TbxMatNotificationConfig } from '../models/notification-config.model';
import { type NotificationDataDto } from '../models/notification-data-dto.model';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationCloseFontIconService } from './notification-close-font-icon.service';
import {
    NOTIFICATION_DEFAULT_DURATION_MS,
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
const PANEL_CLASS_MAP: Readonly<Record<TbxMatSeverityLevel, string>> = {
    [TbxMatSeverityLevel.Success]: 'tbx-mat-notification-snackbar-success',
    [TbxMatSeverityLevel.Error]: 'tbx-mat-notification-snackbar-error',
    [TbxMatSeverityLevel.Warning]: 'tbx-mat-notification-snackbar-warning',
    [TbxMatSeverityLevel.Information]: 'tbx-mat-notification-snackbar-info',
    [TbxMatSeverityLevel.Help]: 'tbx-mat-notification-snackbar-help',
};

/**
 * Application-wide notification service
 *
 * @remarks
 * Wraps {@link https://material.angular.io/components/snack-bar | Angular Material's MatSnackBar}
 * with typed severity levels, consistent positioning, configurable duration, and a
 * custom snackbar component that displays an optional severity icon + message +
 * optional dismiss button.
 *
 * Notifications are queued FIFO and displayed one at a time. When the current
 * notification is dismissed (manually or by timeout), the next queued notification
 * is shown automatically. This follows
 * {@link https://m3.material.io/components/snackbar | Material Design} guidelines —
 * only one snackbar should be visible at a time.
 *
 * Queue state is exposed via {@link https://angular.dev/guide/signals | Angular signals}
 * for reactive consumption:
 * - `isActive()` — whether a notification is currently visible
 * - `pendingCount()` — number of notifications waiting in the queue
 *
 * @usage
 * Inject the service and call the convenience methods for each severity level.
 * Use `show()` when full control over configuration is needed. Use `dismiss()`
 * and `dismissAll()` to programmatically clear notifications. Bind `isActive()`
 * and `pendingCount()` in templates or computed signals for reactive state.
 *
 * @example Convenience methods:
 * ```typescript
 * private readonly notify = inject(TbxMatNotificationService);
 *
 * this.notify.success('Item saved successfully.');
 * this.notify.error('Failed to load data. Please try again.');
 * this.notify.warning('Your session will expire in 5 minutes.');
 * this.notify.information('New version available.');
 * this.notify.help('Click the + button to add a new item.');
 * ```
 *
 * @example Full control via show():
 * ```typescript
 * this.notify.show({
 *     type: TbxMatSeverityLevel.Warning,
 *     message: 'Unsaved changes will be lost.',
 *     duration: 6000,
 *     showCountdown: true,
 *     showSeverityIcon: false,
 *     showCloseButton: false,
 * });
 * ```
 *
 * @example Queue and reactive state:
 * ```typescript
 * this.notify.success('Step 1 complete.');
 * this.notify.success('Step 2 complete.');
 * this.notify.success('All done!');
 * // Shows each notification in order, advancing when the previous is dismissed.
 *
 * this.notify.dismissAll(); // Clear current + all queued notifications.
 * ```
 *
 * @category Services
 * @since 1.0.0
 * @related TbxMatNotificationConfig
 * @related TbxMatNotificationConfigArgs
 * @related TBX_MAT_NOTIFICATION_PROVIDER_CONFIG
 *
 * @public
 */
@Injectable({ providedIn: 'root' })
export class TbxMatNotificationService {
    private readonly snackBar = inject(MatSnackBar);
    private readonly providerConfig = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG);
    private readonly defaultCloseIconService = new TbxMatNotificationCloseFontIconService();

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
     * Whether a notification is currently being displayed
     *
     * @remarks
     * Reactive {@link https://angular.dev/guide/signals | Angular signal} —
     * usable in templates, `computed()`, and `effect()`.
     *
     * @public
     */
    readonly isActive = signal(false);

    /**
     * Number of notifications waiting in the queue (not including the active one)
     *
     * @remarks
     * Reactive {@link https://angular.dev/guide/signals | Angular signal} —
     * usable in templates, `computed()`, and `effect()`.
     *
     * @public
     */
    readonly pendingCount = signal(0);

    /**
     * Queue a notification for display
     *
     * @remarks
     * If no notification is currently visible, it displays immediately.
     * Otherwise, it is added to the FIFO queue and shown when all preceding
     * notifications have been dismissed.
     *
     * Duration is clamped to [NOTIFICATION_MIN_DURATION_MS, NOTIFICATION_MAX_DURATION_MS].
     * Defaults to NOTIFICATION_DEFAULT_DURATION_MS when omitted.
     *
     * @param config - Full notification configuration.
     *
     * @public
     */
    show(config: TbxMatNotificationConfig): void {
        this.queue.push(config);
        this.pendingCount.set(this.queue.length);

        if (!this.isActive()) {
            this.showNext();
        }
    }

    /**
     * Dismiss the currently visible notification
     *
     * @remarks
     * If queued notifications remain, the next one is shown automatically
     * via the afterDismissed() subscription chain.
     *
     * @public
     */
    dismiss(): void {
        this.snackBar.dismiss();
    }

    /**
     * Dismiss the current notification and clear the entire queue
     *
     * @remarks
     * No further queued notifications will be shown.
     * Unsubscribes from the active afterDismissed() subscription before
     * dismissing to prevent the callback from firing showNext() on a
     * cleared queue.
     *
     * @public
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
     * Display a success notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, position, countdown, and visibility options.
     *
     * @public
     */
    success(message: string, configArgs?: TbxMatNotificationConfigArgs): void {
        this.show({ type: TbxMatSeverityLevel.Success, message, ...configArgs });
    }

    /**
     * Display an error notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, position, countdown, and visibility options.
     *
     * @public
     */
    error(message: string, configArgs?: TbxMatNotificationConfigArgs): void {
        this.show({ type: TbxMatSeverityLevel.Error, message, ...configArgs });
    }

    /**
     * Display a warning notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, position, countdown, and visibility options.
     *
     * @public
     */
    warning(message: string, configArgs?: TbxMatNotificationConfigArgs): void {
        this.show({ type: TbxMatSeverityLevel.Warning, message, ...configArgs });
    }

    /**
     * Display an informational notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, position, countdown, and visibility options.
     *
     * @public
     */
    information(message: string, configArgs?: TbxMatNotificationConfigArgs): void {
        this.show({ type: TbxMatSeverityLevel.Information, message, ...configArgs });
    }

    /**
     * Display a help notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, position, countdown, and visibility options.
     *
     * @public
     */
    help(message: string, configArgs?: TbxMatNotificationConfigArgs): void {
        this.show({ type: TbxMatSeverityLevel.Help, message, ...configArgs });
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

        const data: NotificationDataDto = {
            type: config.type,
            message: config.message,
            dismissByClose: () => this.snackBar.dismiss(),
            dismissByAction: () => this.snackBar.dismiss(),
            duration,
            showCountdown: config.showCountdown ?? false,
            showSeverityIcon: config.showSeverityIcon ?? true,
            showCloseButton: config.showCloseButton ?? true,
            closeIconResolverService:
                this.providerConfig.closeIconResolverService ?? this.defaultCloseIconService,
        };

        const snackBarConfig: MatSnackBarConfig<NotificationDataDto> = {
            ...config.snackBarConfig,
            duration,
            panelClass: PANEL_CLASS_MAP[config.type],
            data,
        };

        const ref = this.snackBar.openFromComponent(TbxMatNotificationComponent, snackBarConfig);

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
