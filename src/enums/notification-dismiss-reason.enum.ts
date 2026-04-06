/**
 * Reason a notification was dismissed
 *
 * @remarks
 * Returned as part of {@link TbxMatNotificationResult} via
 * {@link TbxMatNotificationRef.result}. Each value corresponds to a
 * distinct dismissal trigger:
 *
 * - `Action` — the user clicked the action button.
 * - `Close` — the user clicked the close button.
 * - `Timeout` — the notification auto-dismissed after the configured duration expired.
 * - `ProgrammaticDismissAll` — {@link TbxMatNotificationService.dismissAll} was called,
 *   clearing the queue and dismissing the active notification.
 * - `ProgrammaticDismissCurrent` — {@link TbxMatNotificationService.dismiss} was called,
 *   dismissing only the currently active notification.
 *
 * When the consumer dismisses via the native
 * {@link https://material.angular.dev/components/snack-bar/api | MatSnackBarRef}
 * obtained from {@link TbxMatNotificationRef.snackBarRef}, the enriched reason
 * tracking is bypassed — the result may resolve with `Timeout` instead of the
 * expected programmatic reason. Use the service convenience methods for accurate
 * reason tracking.
 *
 * @usage
 * Inspect the dismiss reason after awaiting the result promise to determine
 * which user or programmatic action closed the notification.
 *
 * @example
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
 * @category Enums
 * @displayName Notification Dismiss Reason
 * @order 1
 * @since 6.0.0
 * @related TbxMatNotificationResult
 * @related TbxMatNotificationRef
 *
 * @public
 */
export enum TbxMatNotificationDismissReason {
    /**
     * The user clicked the action button
     *
     * @public
     */
    Action = 'action',

    /**
     * The user clicked the close button
     *
     * @public
     */
    Close = 'close',

    /**
     * The notification auto-dismissed after the configured duration expired
     *
     * @public
     */
    Timeout = 'timeout',

    /**
     * {@link TbxMatNotificationService.dismissAll} was called programmatically
     *
     * @remarks
     * All queued notifications and the active notification are dismissed.
     * Queued notifications that were never displayed resolve their
     * {@link TbxMatNotificationRef.snackBarRef} promise with `null`.
     *
     * @public
     */
    ProgrammaticDismissAll = 'programmatic-dismiss-all',

    /**
     * {@link TbxMatNotificationService.dismiss} was called programmatically
     *
     * @remarks
     * Only the currently active notification is dismissed. Queued
     * notifications are not affected.
     *
     * @public
     */
    ProgrammaticDismissCurrent = 'programmatic-dismiss-current',
}
