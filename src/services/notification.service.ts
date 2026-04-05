import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatNotificationComponent } from '../components/notification.component';
import { type TbxMatNotificationConfigArgs } from '../types/notification-config-args.type';
import { type TbxMatNotificationConfig } from '../models/notification-config.model';
import { type TbxMatNotificationRef } from '../models/notification-ref.model';
import { type TbxMatNotificationResult } from '../models/notification-result.model';
import { type NotificationDataDto } from '../models/notification-data-dto.model';
import { TbxMatNotificationDismissReason } from '../enums/notification-dismiss-reason.enum';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationCloseFontIconService } from './notification-close-font-icon.service';
import { NOTIFICATION_DEFAULT_DURATION_MS, NOTIFICATION_DEFAULT_ACTION_BUTTON_TYPE, NOTIFICATION_DEFAULT_ICON_POSITION } from '../constants/notification.constants';
import { type TbxMatNotificationAction } from '../models/notification-action.model';
import { type TbxMatNotificationActionButtonAppearance } from '../types/notification-action-button-appearance.type';

/**
 * Panel CSS class mapping for each notification severity level.
 *
 * These classes are applied to the
 * {@link https://material.angular.dev/components/snack-bar/api | MatSnackBar}
 * overlay container via `MatSnackBarConfig.panelClass`. The corresponding styles are defined
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
 * Internal queue entry. Pairs a notification config with the promise
 * resolvers needed to fulfill the TbxMatNotificationRef returned to
 * the consumer.
 */
interface QueueEntry {
    readonly config: TbxMatNotificationConfig;
    readonly resolveSnackBarRef: (ref: import('@angular/material/snack-bar').MatSnackBarRef<unknown> | null) => void;
    readonly resolveResult: (result: TbxMatNotificationResult) => void;
}

/**
 * Application-wide notification service
 *
 * @remarks
 * Wraps {@link https://material.angular.dev/components/snack-bar/api | Angular Material's MatSnackBar}
 * with typed severity levels, configurable duration, and a
 * custom snackbar component that displays an optional severity icon + message +
 * optional action button + optional dismiss button.
 *
 * Notifications are queued FIFO and displayed one at a time. When the current
 * notification is dismissed (manually or by timeout), the next queued notification
 * is shown automatically. This follows
 * {@link https://m3.material.io/components/snackbar | Material Design} guidelines —
 * only one snackbar should be visible at a time.
 *
 * All public methods return a {@link TbxMatNotificationRef} synchronously,
 * containing the consumer's config and two promises:
 * - `snackBarRef` — resolves with the native
 *   {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarRef}
 *   when the notification displays, or `null` if cleared from the queue.
 * - `result` — resolves with a {@link TbxMatNotificationResult} containing the
 *   {@link TbxMatNotificationDismissReason} when the notification is dismissed.
 *
 * Consumers who do not need the ref or result should use the `void` prefix
 * to suppress unhandled-promise lint warnings:
 * ```typescript
 * void this.notificationService.success('Saved');
 * ```
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
 * @example Fire-and-forget convenience methods:
 * ```typescript
 * private readonly notify = inject(TbxMatNotificationService);
 *
 * void this.notify.success('Item saved successfully.');
 * void this.notify.error('Failed to load data. Please try again.');
 * ```
 *
 * @example Reacting to action dismissal:
 * ```typescript
 * const ref = this.notify.success('Item deleted.', {
 *     action: { label: 'Undo' },
 *     duration: 30_000,
 * });
 *
 * const result = await ref.result;
 * if (result.dismissReason === TbxMatNotificationDismissReason.Action) {
 *     this.undoDelete();
 * }
 * ```
 *
 * @example Accessing the native snackbar ref:
 * ```typescript
 * const ref = this.notify.error('Upload failed.', {
 *     action: { label: 'Retry' },
 * });
 *
 * const snackBarRef = await ref.snackBarRef;
 * snackBarRef?.afterOpened().subscribe(() => {
 *     console.log('Notification is visible');
 * });
 * ```
 *
 * @category Services
 * @since 1.0.0
 * @related TbxMatNotificationConfig
 * @related TbxMatNotificationConfigArgs
 * @related TbxMatNotificationRef
 * @related TbxMatNotificationResult
 * @related TBX_MAT_NOTIFICATION_PROVIDER_CONFIG
 *
 * @public
 */
@Injectable({ providedIn: 'root' })
export class TbxMatNotificationService {
    private readonly snackBar = inject(MatSnackBar);
    private readonly providerConfig = inject(TBX_MAT_NOTIFICATION_PROVIDER_CONFIG);
    private readonly defaultCloseIconService = new TbxMatNotificationCloseFontIconService();
    private destroyed = false;

    constructor() {
        inject(DestroyRef).onDestroy(() => {
            this.destroyed = true;
            this.activeSubscription?.unsubscribe();
            this.activeSubscription = null;
        });
    }

    /**
     * FIFO queue of pending notifications. Each entry pairs the consumer
     * config with the promise resolvers for the TbxMatNotificationRef.
     */
    private readonly queue: QueueEntry[] = [];

    /**
     * Subscription to the current notification's afterDismissed() observable.
     * Tracked so dismissAll() can unsubscribe before dismissing, preventing
     * the afterDismissed callback from firing showNext() on a cleared queue.
     */
    private activeSubscription: Subscription | null = null;

    /** Resolver for the active notification's result promise. */
    private activeResultResolver: ((result: TbxMatNotificationResult) => void) | null = null;

    /**
     * Guards against double-resolution of the active result promise.
     * Multiple code paths can trigger dismissal (action click, close click,
     * timeout, programmatic). Only the first path resolves the promise.
     */
    private activeResultResolved = false;

    /**
     * Set by dismissByClose() before calling snackBar.dismiss().
     * Read by the afterDismissed() handler to distinguish close from timeout.
     */
    private closeFlag = false;

    /**
     * Set by dismiss() before calling snackBar.dismiss().
     * Read by the afterDismissed() handler to distinguish programmatic
     * dismiss from timeout.
     */
    private programmaticDismissCurrentFlag = false;

    private readonly _isActive = signal(false);
    private readonly _pendingCount = signal(0);

    /**
     * Whether a notification is currently being displayed
     *
     * @remarks
     * Reactive {@link https://angular.dev/guide/signals | Angular signal} —
     * usable in templates, `computed()`, and `effect()`.
     *
     * @public
     */
    readonly isActive = this._isActive.asReadonly();

    /**
     * Number of notifications waiting in the queue (not including the active one)
     *
     * @remarks
     * Reactive {@link https://angular.dev/guide/signals | Angular signal} —
     * usable in templates, `computed()`, and `effect()`.
     *
     * @public
     */
    readonly pendingCount = this._pendingCount.asReadonly();

    /**
     * Queue a notification for display
     *
     * @remarks
     * If no notification is currently visible, it displays immediately.
     * Otherwise, it is added to the FIFO queue and shown when all preceding
     * notifications have been dismissed.
     *
     * Duration: zero or negative is indefinite (no auto-dismiss), positive
     * is used as-is. Defaults to NOTIFICATION_DEFAULT_DURATION_MS (10000ms)
     * when omitted.
     *
     * @param config - Full notification configuration.
     *
     * @returns A {@link TbxMatNotificationRef} with the consumer's config,
     * a promise for the native snackbar ref, and a promise for the dismiss result.
     *
     * @public
     */
    show(config: TbxMatNotificationConfig): TbxMatNotificationRef {
        let resolveSnackBarRef!: QueueEntry['resolveSnackBarRef'];
        let resolveResult!: QueueEntry['resolveResult'];

        const snackBarRefPromise = new Promise<import('@angular/material/snack-bar').MatSnackBarRef<unknown> | null>((resolve) => {
            resolveSnackBarRef = resolve;
        });

        const resultPromise = new Promise<TbxMatNotificationResult>((resolve) => {
            resolveResult = resolve;
        });

        this.queue.push({ config, resolveSnackBarRef, resolveResult });
        this._pendingCount.set(this.queue.length);

        if (!this.isActive()) {
            this.showNext();
        }

        return {
            config,
            snackBarRef: snackBarRefPromise,
            result: resultPromise,
        };
    }

    /**
     * Dismiss the currently visible notification
     *
     * @remarks
     * Convenience wrapper that sets the programmatic dismiss flag and calls
     * `MatSnackBar.dismiss()`. The active notification's
     * {@link TbxMatNotificationRef.result} promise resolves with
     * {@link TbxMatNotificationDismissReason.ProgrammaticDismissCurrent}.
     *
     * If queued notifications remain, the next one is shown automatically
     * via the afterDismissed() subscription chain. Queued notifications
     * are not affected.
     *
     * Prefer this method over calling `dismiss()` directly on the native
     * {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarRef}
     * obtained from {@link TbxMatNotificationRef.snackBarRef} — the native
     * ref does not set the programmatic flag, so the result promise would
     * resolve with `Timeout` instead of `ProgrammaticDismissCurrent`.
     *
     * @public
     */
    dismiss(): void {
        this.programmaticDismissCurrentFlag = true;
        this.snackBar.dismiss();
    }

    /**
     * Dismiss the current notification and clear the entire queue
     *
     * @remarks
     * Convenience wrapper. No further queued notifications will be shown.
     *
     * All queued (not yet displayed) notifications have their
     * {@link TbxMatNotificationRef.snackBarRef} promise resolved with `null`
     * and their {@link TbxMatNotificationRef.result} promise resolved with
     * {@link TbxMatNotificationDismissReason.ProgrammaticDismissAll}.
     *
     * The active notification's result promise is also resolved with
     * `ProgrammaticDismissAll` before the snackbar is dismissed.
     *
     * @public
     */
    dismissAll(): void {
        // Resolve all queued (not yet displayed) notification promises.
        for (const entry of this.queue) {
            entry.resolveSnackBarRef(null);
            entry.resolveResult({
                dismissReason: TbxMatNotificationDismissReason.ProgrammaticDismissAll,
            });
        }
        this.queue.length = 0;
        this._pendingCount.set(0);

        // Unsubscribe BEFORE dismissing — prevents afterDismissed()
        // from firing showNext() with an empty queue.
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
            this.activeSubscription = null;
        }

        // Resolve the active notification's result promise.
        if (this.activeResultResolver && !this.activeResultResolved) {
            this.activeResultResolver({
                dismissReason: TbxMatNotificationDismissReason.ProgrammaticDismissAll,
            });
            this.activeResultResolver = null;
            this.activeResultResolved = true;
        }

        this.snackBar.dismiss();
        this._isActive.set(false);
    }

    /**
     * Display a success notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, action, countdown, and visibility options.
     *
     * @returns A {@link TbxMatNotificationRef} for the queued notification.
     *
     * @public
     */
    success(message: string, configArgs?: TbxMatNotificationConfigArgs): TbxMatNotificationRef {
        return this.show({ type: TbxMatSeverityLevel.Success, message, ...configArgs });
    }

    /**
     * Display an error notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, action, countdown, and visibility options.
     *
     * @returns A {@link TbxMatNotificationRef} for the queued notification.
     *
     * @public
     */
    error(message: string, configArgs?: TbxMatNotificationConfigArgs): TbxMatNotificationRef {
        return this.show({ type: TbxMatSeverityLevel.Error, message, ...configArgs });
    }

    /**
     * Display a warning notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, action, countdown, and visibility options.
     *
     * @returns A {@link TbxMatNotificationRef} for the queued notification.
     *
     * @public
     */
    warning(message: string, configArgs?: TbxMatNotificationConfigArgs): TbxMatNotificationRef {
        return this.show({ type: TbxMatSeverityLevel.Warning, message, ...configArgs });
    }

    /**
     * Display an informational notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, action, countdown, and visibility options.
     *
     * @returns A {@link TbxMatNotificationRef} for the queued notification.
     *
     * @public
     */
    information(message: string, configArgs?: TbxMatNotificationConfigArgs): TbxMatNotificationRef {
        return this.show({ type: TbxMatSeverityLevel.Information, message, ...configArgs });
    }

    /**
     * Display a help notification
     *
     * @param message - The message to display to the user.
     * @param configArgs - Optional overrides for duration, action, countdown, and visibility options.
     *
     * @returns A {@link TbxMatNotificationRef} for the queued notification.
     *
     * @public
     */
    help(message: string, configArgs?: TbxMatNotificationConfigArgs): TbxMatNotificationRef {
        return this.show({ type: TbxMatSeverityLevel.Help, message, ...configArgs });
    }

    /**
     * Shift the next notification off the queue and display it.
     * Resolves the snackBarRef promise with the native ref.
     * Subscribes to afterDismissed() to resolve the result promise
     * and chain to the following notification.
     * When the queue is empty, sets isActive to false and stops.
     *
     * ## Dismiss Flows
     *
     * Five code paths can dismiss the active notification. Each resolves
     * the result promise with a distinct TbxMatNotificationDismissReason:
     *
     * 1. **Action click** — component calls dismissByAction() →
     *    snackBarRef.dismissWithAction() → afterDismissed() fires with
     *    dismissedByAction: true → resolves with Action.
     *
     * 2. **Close click** — component calls dismissByClose() → sets
     *    closeFlag → snackBarRef.dismiss() → afterDismissed() fires →
     *    closeFlag is true → resolves with Close.
     *
     * 3. **Timeout** — snackbar auto-dismisses after duration →
     *    afterDismissed() fires → no flags set → resolves with Timeout.
     *
     * 4. **dismiss()** — service sets programmaticDismissCurrentFlag →
     *    snackBar.dismiss() → afterDismissed() fires → flag is true →
     *    resolves with ProgrammaticDismissCurrent.
     *
     * 5. **dismissAll()** — resolves all queued + active promises with
     *    ProgrammaticDismissAll, unsubscribes from afterDismissed(),
     *    then dismisses. afterDismissed() does not fire (unsubscribed).
     *
     * The activeResultResolved guard ensures only the first path
     * resolves the promise — subsequent paths are no-ops.
     */
    private showNext(): void {
        // Guard: if the injector has been destroyed (e.g., Storybook
        // navigated away), do not attempt to open a new snackbar.
        /* v8 ignore start -- DestroyRef guard; not reachable in unit tests */
        if (this.destroyed) {
            return;
        }
        /* v8 ignore stop */

        const entry = this.queue.shift();
        this._pendingCount.set(this.queue.length);

        if (!entry) {
            this._isActive.set(false);
            return;
        }

        const { config, resolveSnackBarRef, resolveResult } = entry;

        this._isActive.set(true);
        this.activeResultResolver = resolveResult;
        this.activeResultResolved = false;
        this.closeFlag = false;
        this.programmaticDismissCurrentFlag = false;
        const duration = this.resolveDuration(config.duration);

        // snackBarRef is assigned after openFromComponent() — the DTO
        // callbacks capture it via closure so they can call the correct
        // dismiss method on the actual ref instance.
        let snackBarRef: import('@angular/material/snack-bar').MatSnackBarRef<unknown> | null = null;

        // Resolve action config using cascade and fallback rules.
        const resolvedAction = this.resolveAction(config.action);

        const data: NotificationDataDto = {
            type: config.type,
            message: config.message,
            // Close button: sets flag, then dismisses. The afterDismissed()
            // handler reads the flag to resolve with Close.
            dismissByClose: () => {
                this.closeFlag = true;
                snackBarRef?.dismiss();
            },
            // Action button: calls dismissWithAction() so
            // MatSnackBarDismiss.dismissedByAction is true. The
            // afterDismissed() handler reads this to resolve with Action.
            dismissByAction: () => {
                snackBarRef?.dismissWithAction();
            },
            duration,
            showCountdown: config.showCountdown ?? false,
            showSeverityIcon: config.showSeverityIcon ?? true,
            showCloseButton: config.showCloseButton ?? true,
            closeIconResolverService: this.providerConfig.closeIconResolverService ?? this.defaultCloseIconService,
            ...resolvedAction,
        };

        // Merge consumer panelClass with the severity panel class.
        // Consumer classes are appended, not replaced.
        const consumerPanelClass = config.snackBarConfig?.panelClass;
        const mergedPanelClass: string[] = [PANEL_CLASS_MAP[config.type], ...(Array.isArray(consumerPanelClass) ? consumerPanelClass : consumerPanelClass ? [consumerPanelClass] : [])];

        const snackBarConfig: MatSnackBarConfig<NotificationDataDto> = {
            ...config.snackBarConfig,
            duration,
            panelClass: mergedPanelClass,
            data,
        };

        const ref = this.snackBar.openFromComponent(TbxMatNotificationComponent, snackBarConfig);
        snackBarRef = ref;

        // Resolve the snackBarRef promise — notification is now displayed.
        resolveSnackBarRef(ref);

        // afterDismissed() fires exactly once when the snackbar closes,
        // regardless of cause. The dismiss reason is determined by:
        //   1. dismissedByAction === true → Action (user clicked action button)
        //   2. closeFlag === true → Close (user clicked close button)
        //   3. programmaticDismissCurrentFlag === true → ProgrammaticDismissCurrent
        //   4. none of the above → Timeout (auto-dismissed by duration)
        this.activeSubscription = ref.afterDismissed().subscribe((dismiss) => {
            this.activeSubscription = null;

            // Guard: only resolve if not already resolved. The false branch
            // is a race condition guard — it fires only if two dismiss paths
            // trigger simultaneously on the same notification, which cannot
            // be reliably reproduced in unit tests.
            if (!this.activeResultResolved && this.activeResultResolver) {
                let reason: TbxMatNotificationDismissReason;

                if (dismiss.dismissedByAction) {
                    reason = TbxMatNotificationDismissReason.Action;
                } else if (this.closeFlag) {
                    reason = TbxMatNotificationDismissReason.Close;
                } else if (this.programmaticDismissCurrentFlag) {
                    reason = TbxMatNotificationDismissReason.ProgrammaticDismissCurrent;
                } else {
                    reason = TbxMatNotificationDismissReason.Timeout;
                }

                this.activeResultResolver({ dismissReason: reason });
                this.activeResultResolver = null;
                this.activeResultResolved = true;
            }

            this.showNext();
        });
    }

    /**
     * Resolve duration from consumer config.
     * - undefined → default (NOTIFICATION_DEFAULT_DURATION_MS)
     * - zero or negative → 0 (indefinite, no auto-dismiss)
     * - positive → as-is, no clamping
     */
    private resolveDuration(duration: number | undefined): number {
        if (duration === undefined) {
            return NOTIFICATION_DEFAULT_DURATION_MS;
        }

        return duration <= 0 ? 0 : duration;
    }

    /**
     * Resolve action configuration from per-notification, provider, and
     * defaults. Returns the resolved action fields for the DTO, or
     * undefined if no action is configured or the configuration is invalid.
     *
     * Resolution cascade (per property):
     *   per-notification → provider actionConfig → package default
     *
     * Fallback rules:
     *   - actionButtonType 'icon' but no iconName → fallback to 'text'
     *   - actionButtonType 'text' with iconName → icon ignored
     *   - iconName provided and button type uses icons, but no resolver → log error, skip action
     */
    private resolveAction(action: TbxMatNotificationAction | undefined): Pick<NotificationDataDto, 'actionLabel' | 'actionButtonType' | 'actionIconName' | 'actionIconPosition' | 'actionIconResolverService'> | undefined {
        if (!action) {
            return undefined;
        }

        const providerAction = this.providerConfig.actionConfig;

        // Resolve button type: per-notification → provider → default
        let resolvedButtonType: TbxMatNotificationActionButtonAppearance = action.actionButtonType ?? providerAction?.actionButtonType ?? NOTIFICATION_DEFAULT_ACTION_BUTTON_TYPE;

        const hasIcon = !!action.iconName;

        // Fallback: 'icon' without iconName → 'text'
        if (resolvedButtonType === 'icon' && !hasIcon) {
            resolvedButtonType = 'text';
        }

        // Determine if this button type renders an icon
        const buttonUsesIcon = resolvedButtonType === 'icon' || (resolvedButtonType !== 'text' && hasIcon);

        if (buttonUsesIcon && hasIcon) {
            // Resolve icon resolver: per-notification → provider → none
            const resolver = action.actionIconResolverService ?? providerAction?.actionIconResolverService;

            if (!resolver) {
                console.error(`[TbxMatNotificationService] Action icon '${action.iconName}' requires an ` + `actionIconResolverService but none was provided (neither per-notification ` + `nor via provider actionConfig). Action will not be displayed.`);
                return undefined;
            }

            // Resolve icon position: per-notification → provider → default
            const resolvedIconPosition = action.iconPosition ?? providerAction?.iconPosition ?? NOTIFICATION_DEFAULT_ICON_POSITION;

            return {
                actionLabel: action.label,
                actionButtonType: resolvedButtonType,
                actionIconName: action.iconName,
                actionIconPosition: resolvedIconPosition,
                actionIconResolverService: resolver,
            };
        }

        // Text button or button without icon — no resolver needed
        return {
            actionLabel: action.label,
            actionButtonType: resolvedButtonType,
        };
    }
}
