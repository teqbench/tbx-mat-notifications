import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
    NotificationHarnessComponent,
    SHARED_ARG_TYPES,
    DEFAULT_ARGS,
    withDefaultProperties,
    withCustomFontIcons,
    withCustomProperties,
    COMPACT_CSS,
    LARGE_CSS,
    LARGE_ICON_ONLY_CSS,
} from './notification.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Custom Font Icons',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const CATEGORY_DESCRIPTION =
    'Uses CustomFontIconService which overrides the default ligatures via initialize(): ' +
    'task_alt, cancel, warning, lightbulb, contact_support.';

export const Default: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withDefaultProperties(), withCustomFontIcons()],
};

export const Compact: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(COMPACT_CSS), withCustomFontIcons()],
};

export const Large: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(LARGE_CSS), withCustomFontIcons()],
};

export const LargeIconOnly: Story = {
    name: 'Large Icon Only',
    args: {
        ...DEFAULT_ARGS,
        description: CATEGORY_DESCRIPTION,
        verticalPosition: 'top',
        horizontalPosition: 'center',
    },
    decorators: [withCustomProperties(LARGE_ICON_ONLY_CSS), withCustomFontIcons()],
};
