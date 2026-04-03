import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
    NotificationHarnessComponent,
    SHARED_ARG_TYPES,
    DEFAULT_ARGS,
    withDefaultFontIcons,
    withCustomProperties,
    FILLED_CSS,
    COMPACT_CSS,
    LARGE_CSS,
    LARGE_ICON_ONLY_CSS,
} from './notification.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Filled Font Icons',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const CATEGORY_DESCRIPTION =
    'Uses font-variation-settings FILL 1 to render filled Material Symbols. ' +
    'Same default ligatures as the outlined variant (check_circle, error, warning_amber, info, help).';

export const Default: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(FILLED_CSS), withDefaultFontIcons()],
};

export const Compact: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(FILLED_CSS + COMPACT_CSS), withDefaultFontIcons()],
};

export const Large: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(FILLED_CSS + LARGE_CSS), withDefaultFontIcons()],
};

export const LargeIconOnly: Story = {
    name: 'Large Icon Only',
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(FILLED_CSS + LARGE_ICON_ONLY_CSS), withDefaultFontIcons()],
};
