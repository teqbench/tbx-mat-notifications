import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NotificationHarnessComponent, SHARED_ARG_TYPES, DEFAULT_ARGS, withDefaultProperties, withCustomSvgIcons, withCustomSvgIconsAndSvgClose, withCustomProperties, COMPACT_CSS, LARGE_CSS, LARGE_ICON_ONLY_CSS } from './notification.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Custom SVG Icons',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const CATEGORY_DESCRIPTION = 'Uses CustomSvgIconService which overrides the default SVGs via initialize() ' + 'with icons from the "Web 5" collection (SVG Repo, CC0 license).';

export const Default: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withDefaultProperties(), withCustomSvgIcons()],
};

export const Compact: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(COMPACT_CSS), withCustomSvgIcons()],
};

export const Large: Story = {
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(LARGE_CSS), withCustomSvgIcons()],
};

export const LargeIconOnly: Story = {
    name: 'Large Icon Only',
    args: { ...DEFAULT_ARGS, description: CATEGORY_DESCRIPTION },
    decorators: [withCustomProperties(LARGE_ICON_ONLY_CSS), withCustomSvgIcons()],
};

export const SvgCloseIcon: Story = {
    name: 'SVG Close Icon',
    args: {
        ...DEFAULT_ARGS,
        description: CATEGORY_DESCRIPTION + ' Also uses a custom SVG close/dismiss icon registered with MatIconRegistry.',
    },
    decorators: [withDefaultProperties(), withCustomSvgIconsAndSvgClose()],
};
