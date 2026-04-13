# Accessibility

- **Snackbar container.** Notifications render inside [Angular Material's snackbar overlay ↗](https://material.angular.dev/components/snack-bar/api), which announces new snackbars to assistive technology via its built-in politeness handling. Consumers can pass `politeness` through the `snackBarConfig` passthrough on `TbxMatNotificationConfig` to customize the announcement level (`'polite'`, `'assertive'`, or `'off'`).
- **Keyboard.** The action button and close button are focusable in DOM order. `Enter` and `Space` activate them; the native [Material button ↗](https://material.angular.dev) keyboard behavior is preserved.
- **Focus.** Focus is not moved into the notification — they are non-blocking surfaces and should not steal focus from the user's current task.
- **Action button labeling.** Icon-only action buttons (`actionButtonType: 'icon'`) use the `label` field as the button's `aria-label`, so screen readers announce the action's purpose even when no visible text is rendered.
- **Close button labeling.** The close button has a fixed `aria-label="Dismiss notification"` so its purpose is announced consistently across severities and configurations.
- **Severity icons.** Severity icons are decorative and marked `aria-hidden`; the severity meaning is carried by the message text itself, not by the icon alone.
- **Color contrast.** The default severity palette meets [WCAG ↗](https://www.w3.org/WAI/standards-guidelines/wcag/) AA contrast for body text on each background. Overriding the severity CSS custom properties is the consumer's responsibility to re-verify.
