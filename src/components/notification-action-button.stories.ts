import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { withDefaultProperties } from './notification.stories.common';
import { ACTION_BUTTON_ARG_TYPES, ActionButtonHarnessComponent, DEFAULT_ACTION_ARGS, DEFAULT_MATRIX_ARGS, SEVERITY_MATRIX_ARG_TYPES, SeverityMatrixHarnessComponent, type SeverityMatrixArgs, withActionProviderDefaults, withActionProviders } from './notification-action-button.stories.common';

const meta: Meta<ActionButtonHarnessComponent> = {
    title: 'Notifications/Action Button',
    component: ActionButtonHarnessComponent,
    decorators: [moduleMetadata({ imports: [ActionButtonHarnessComponent] })],
    argTypes: ACTION_BUTTON_ARG_TYPES,
};

export default meta;
type Story = StoryObj<ActionButtonHarnessComponent>;

export const Default: Story = {
    args: {
        ...DEFAULT_ACTION_ARGS,
        description: 'Demonstrates all action button variants: appearances (text, tonal, filled, outlined, elevated), icon-only (font + SVG), and icon + label. Use the Controls panel to tweak severity, action label, icon name, position, duration, and visibility flags before clicking a trigger. The "Last dismiss reason" shows the TbxMatNotificationDismissReason returned by the result promise.',
    },
    decorators: [withDefaultProperties(), withActionProviders()],
};

export const ProviderDefaults: Story = {
    name: 'Provider-Level Defaults',
    args: {
        ...DEFAULT_ACTION_ARGS,
        description: 'Provider config sets application-wide action defaults: actionButtonType "tonal", iconPosition Before, and a font icon resolver. Buttons that do not override actionButtonType inherit tonal from the provider (e.g., the Text button renders as tonal). Per-notification overrides still take precedence (Filled, Outlined, Elevated). Icon buttons use the provider resolver as fallback.',
    },
    decorators: [withDefaultProperties(), withActionProviderDefaults()],
};

export const SeverityMatrix: StoryObj<SeverityMatrixArgs> = {
    name: 'Severity × Button Type',
    args: DEFAULT_MATRIX_ARGS,
    argTypes: SEVERITY_MATRIX_ARG_TYPES,
    render: (args) => ({
        props: args,
        template: `<tbx-severity-matrix-harness
            [description]="description"
            [fontIconName]="fontIconName"
            [iconPosition]="iconPosition"
            [showSeverityIcon]="showSeverityIcon"
            [showCloseButton]="showCloseButton"
            [showCountdown]="showCountdown"
            [duration]="duration"
            [horizontalPosition]="horizontalPosition"
            [verticalPosition]="verticalPosition"
            [iconSize]="iconSize"
            [iconAnimation]="iconAnimation"
            [politeness]="politeness"
            [direction]="direction"
        ></tbx-severity-matrix-harness>`,
    }),
    decorators: [moduleMetadata({ imports: [SeverityMatrixHarnessComponent] }), withDefaultProperties(), withActionProviders()],
};
