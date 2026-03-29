import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
    NotificationHarnessComponent,
    SHARED_ARG_TYPES,
    DEFAULT_ARGS,
    withDefaultProperties,
    withDefaultSvgIcons,
    withCustomProperties,
    COMPACT_CSS,
    LARGE_CSS,
    LARGE_ICON_ONLY_CSS,
} from './notification.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Default SVG Icons',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const CATEGORY_DESCRIPTION =
    'Uses TbxMatNotificationSvgIconService with its built-in default SVG icons ' +
    'from the "Small Flat Vectors" collection (SVG Repo, PD license).';

export const Default: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withDefaultProperties(), withDefaultSvgIcons()],
};

export const Compact: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(COMPACT_CSS), withDefaultSvgIcons()],
};

export const Large: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(LARGE_CSS), withDefaultSvgIcons()],
};

export const LargeIconOnly: Story = {
    name: 'Large Icon Only',
    args: {
        ...DEFAULT_ARGS,
        description: CATEGORY_DESCRIPTION,
        horizontalPosition: 'center',
        verticalPosition: 'top',
    },
    decorators: [withCustomProperties(LARGE_ICON_ONLY_CSS), withDefaultSvgIcons()],
};
