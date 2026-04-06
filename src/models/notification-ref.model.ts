import type { MatSnackBarRef } from '@angular/material/snack-bar';

import { type TbxMatNotificationConfig } from './notification-config.model';
import { type TbxMatNotificationResult } from './notification-result.model';

/**
 * Reference to a queued or active notification
 *
 * @remarks
 * Returned synchronously from all {@link TbxMatNotificationService} methods
 * (`show()`, `success()`, `error()`, `warning()`, `information()`, `help()`).
 * Contains three members:
 *
 * - `config` — the consumer-provided configuration, available immediately.
 * - `snackBarRef` — a promise that resolves with the native
 *   {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarRef}
 *   when the notification is displayed (comes off the FIFO queue), or `null`
 *   if the notification was cleared from the queue before being displayed
 *   (e.g., via {@link TbxMatNotificationService.dismissAll}).
 * - `result` — a promise that resolves with a {@link TbxMatNotificationResult}
 *   containing the {@link TbxMatNotificationDismissReason} when the
 *   notification is dismissed.
 *
 * ### Native Ref vs Service Dismiss Methods
 *
 * The `snackBarRef` promise exposes the full
 * {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarRef} API,
 * including `dismiss()`, `dismissWithAction()`, `afterOpened()`,
 * `afterDismissed()`, and `onAction()`. Using the native ref for
 * **read-only operations** (subscriptions, inspection) is safe and
 * recommended. However, calling `dismiss()` or `dismissWithAction()`
 * directly on the native ref **bypasses the enriched
 * {@link TbxMatNotificationDismissReason} tracking** — the `result`
 * promise may resolve with an incorrect reason (e.g., `Timeout` instead
 * of `ProgrammaticDismissCurrent`).
 *
 * For accurate dismiss reason tracking, use the service convenience
 * methods ({@link TbxMatNotificationService.dismiss},
 * {@link TbxMatNotificationService.dismissAll}) or the component's
 * action/close buttons.
 *
 * ### Fire-and-Forget Usage
 *
 * Consumers who do not need the dismiss result or native ref should
 * prefix the call with `void` to suppress unhandled-promise lint warnings:
 *
 * ```typescript
 * void this.notificationService.success('Saved');
 * ```
 *
 * @usage
 * Capture the returned ref to react to notification dismissal, access
 * the native snackbar ref for subscriptions, or inspect the original
 * config.
 *
 * @example Reacting to action dismissal:
 * ```typescript
 * const ref = this.notificationService.success('Item deleted', {
 *     action: { label: 'Undo' },
 *     duration: 30_000,
 * });
 *
 * const result = await ref.result;
 *
 * if (result.dismissReason === TbxMatNotificationDismissReason.Action) {
 *     this.undoDelete();
 * }
 * ```
 *
 * @example Subscribing to native ref events:
 * ```typescript
 * const ref = this.notificationService.error('Upload failed', {
 *     action: { label: 'Retry' },
 * });
 *
 * const snackBarRef = await ref.snackBarRef;
 *
 * snackBarRef?.afterOpened().subscribe(() => {
 *     console.log('Notification is visible');
 * });
 * ```
 *
 * @example Fire-and-forget:
 * ```typescript
 * void this.notificationService.success('Saved');
 * ```
 *
 * @category Models
 * @displayName Notification Ref
 * @order 2
 * @since 6.0.0
 * @related TbxMatNotificationResult
 * @related TbxMatNotificationDismissReason
 * @related TbxMatNotificationConfig
 * @related TbxMatNotificationService
 *
 * @public
 */
export interface TbxMatNotificationRef {
    /**
     * The consumer-provided notification configuration
     *
     * @remarks
     * Available immediately (synchronous). Reflects the original config
     * as passed by the consumer, not the resolved config with defaults
     * applied.
     *
     * @public
     */
    readonly config: TbxMatNotificationConfig;

    /**
     * Native snackbar ref, available when the notification is displayed
     *
     * @remarks
     * Resolves with the
     * {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarRef}
     * when the notification comes off the FIFO queue and is rendered.
     * Resolves with `null` if the notification was cleared from the queue
     * before being displayed (e.g., via
     * {@link TbxMatNotificationService.dismissAll}).
     *
     * The generic type parameter is `unknown` because the internal
     * notification component is an implementation detail. Use the ref
     * for its methods (`afterOpened()`, `onAction()`, etc.), not for
     * accessing the component instance.
     *
     * @public
     */
    readonly snackBarRef: Promise<MatSnackBarRef<unknown> | null>;

    /**
     * Dismiss result, available when the notification is dismissed
     *
     * @remarks
     * Resolves with a {@link TbxMatNotificationResult} containing the
     * {@link TbxMatNotificationDismissReason} that caused the dismissal.
     *
     * @public
     */
    readonly result: Promise<TbxMatNotificationResult>;
}
