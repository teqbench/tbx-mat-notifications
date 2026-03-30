import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
    NotificationHarnessComponent,
    SHARED_ARG_TYPES,
    DEFAULT_ARGS,
    withDefaultProperties,
    withDefaultFontIcons,
    withCustomProperties,
    COMPACT_CSS,
    LARGE_CSS,
    LARGE_ICON_ONLY_CSS,
} from './notification.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Default Font Icons',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const CATEGORY_DESCRIPTION =
    'Uses TbxMatNotificationFontIconService with its default Material Symbols ligatures: ' +
    'check_circle, error, warning_amber, info, help.';

export const Default: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withDefaultProperties(), withDefaultFontIcons()],
};

export const Compact: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(COMPACT_CSS), withDefaultFontIcons()],
};

export const Large: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(LARGE_CSS), withDefaultFontIcons()],
};

export const LargeIconOnly: Story = {
    name: 'Large Icon Only',
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(LARGE_ICON_ONLY_CSS), withDefaultFontIcons()],
};
