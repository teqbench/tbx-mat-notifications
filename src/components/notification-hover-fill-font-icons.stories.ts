import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
    NotificationHarnessComponent,
    SHARED_ARG_TYPES,
    DEFAULT_ARGS,
    withDefaultFontIcons,
    withCustomProperties,
    HOVER_FILL_CSS,
    COMPACT_CSS,
    LARGE_CSS,
    LARGE_ICON_ONLY_CSS,
} from './notification.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Hover Fill Font Icons',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const CATEGORY_DESCRIPTION =
    'Icons render outlined (FILL 0) by default and transition to filled (FILL 1) on hover. ' +
    'Hover over an icon to see the effect.';

export const Default: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(HOVER_FILL_CSS), withDefaultFontIcons()],
};

export const Compact: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(HOVER_FILL_CSS + COMPACT_CSS), withDefaultFontIcons()],
};

export const Large: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(HOVER_FILL_CSS + LARGE_CSS), withDefaultFontIcons()],
};

export const LargeIconOnly: Story = {
    name: 'Large Icon Only',
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [
        withCustomProperties(HOVER_FILL_CSS + LARGE_ICON_ONLY_CSS),
        withDefaultFontIcons(),
    ],
};
