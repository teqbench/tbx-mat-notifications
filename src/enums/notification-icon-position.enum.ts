/**
 * Position of an icon relative to the action button label
 *
 * @remarks
 * Controls whether an icon renders before or after the label text
 * on an action button. Applies only when the resolved
 * {@link TbxMatNotificationActionButtonAppearance} is not `'icon'`
 * (icon-only buttons have no label to position relative to).
 *
 * The position can be set at the provider level via
 * {@link TbxMatNotificationProviderActionConfig.iconPosition} or
 * per-notification via {@link TbxMatNotificationAction.iconPosition}.
 * Per-notification takes precedence. When neither is set, defaults
 * to `Before`.
 *
 * @usage
 * Set the icon position when an action button has both a label and
 * an icon, and the default leading position is not desired.
 *
 * @example
 * ```typescript
 * this.notificationService.success('File uploaded', {
 *     action: {
 *         label: 'View',
 *         iconName: 'open_in_new',
 *         iconPosition: TbxMatNotificationIconPosition.After,
 *     },
 * });
 * ```
 *
 * @category Enums
 * @displayName Notification Icon Position
 * @order 2
 * @since 6.0.0
 * @related TbxMatNotificationAction
 * @related TbxMatNotificationProviderActionConfig
 *
 * @public
 */
export enum TbxMatNotificationIconPosition {
    /**
     * Icon renders before the label text (leading edge)
     *
     * @public
     */
    Before = 'before',

    /**
     * Icon renders after the label text (trailing edge)
     *
     * @public
     */
    After = 'after',
}
