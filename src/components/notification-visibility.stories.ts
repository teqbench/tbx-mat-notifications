import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
    NotificationHarnessComponent,
    SHARED_ARG_TYPES,
    DEFAULT_ARGS,
    withDefaultProperties,
} from './notification.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Visibility',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

export const HiddenSeverityIcon: Story = {
    name: 'Hidden Severity Icon',
    args: {
        ...DEFAULT_ARGS,
        showSeverityIcon: false,
        description:
            'showSeverityIcon is set to false. Notifications display only the message text ' +
            'and dismiss button — the severity icon is omitted. The panel color still indicates ' +
            'the severity level.',
    },
    decorators: [withDefaultProperties()],
};

export const HiddenCloseButton: Story = {
    name: 'Hidden Close Button',
    args: {
        ...DEFAULT_ARGS,
        showCloseButton: false,
        description:
            'showCloseButton is set to false. Notifications dismiss only via the duration ' +
            'timeout or programmatically — there is no close button. Use the "With Countdown" ' +
            'buttons to see the auto-dismiss countdown.',
    },
    decorators: [withDefaultProperties()],
};

export const MessageOnly: Story = {
    name: 'Message Only',
    args: {
        ...DEFAULT_ARGS,
        showSeverityIcon: false,
        showCloseButton: false,
        description:
            'Both showSeverityIcon and showCloseButton are set to false. Notifications display ' +
            'only the message text with the severity panel color. Use the "With Countdown" buttons ' +
            'to see the auto-dismiss countdown.',
    },
    decorators: [withDefaultProperties()],
};
