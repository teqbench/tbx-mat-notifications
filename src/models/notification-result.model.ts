import { type TbxMatNotificationDismissReason } from '../enums/notification-dismiss-reason.enum';

/**
 * Result returned when a notification is dismissed
 *
 * @remarks
 * Resolved by the {@link TbxMatNotificationRef.result} promise when a
 * notification is dismissed for any reason — user action, timeout, or
 * programmatic dismissal. The {@link dismissReason} property indicates
 * which trigger caused the dismissal.
 *
 * @usage
 * Await the result promise from any {@link TbxMatNotificationService} method
 * to determine how a notification was dismissed and react accordingly.
 *
 * @example
 * ```typescript
 * const ref = this.notificationService.success('Item deleted', {
 *     action: { label: 'Undo' },
 *     duration: 30_000,
 * });
 *
 * const result: TbxMatNotificationResult = await ref.result;
 *
 * if (result.dismissReason === TbxMatNotificationDismissReason.Action) {
 *     this.undoDelete();
 * }
 * ```
 *
 * @category Models
 * @displayName Notification Result
 * @order 3
 * @since 6.0.0
 * @related TbxMatNotificationDismissReason
 * @related TbxMatNotificationRef
 *
 * @public
 */
export interface TbxMatNotificationResult {
    /**
     * The reason the notification was dismissed
     *
     * @public
     */
    readonly dismissReason: TbxMatNotificationDismissReason;
}
