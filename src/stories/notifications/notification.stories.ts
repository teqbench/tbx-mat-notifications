import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatNotificationSeveritySvgIconService } from '../../index';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../../tokens/notification-provider-config.token';
import { DEFAULT_ARGS, NotificationHarnessComponent, SHARED_ARG_TYPES } from '../../components/notification.stories.common';
import { ACTION_BUTTON_ARG_TYPES, ActionButtonHarnessComponent, DEFAULT_ACTION_ARGS, withActionProviders } from '../../components/notification-action-button.stories.common';

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications',
    tags: ['notifications'],
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const SHARED_ARGS = {
    ...DEFAULT_ARGS,
    showCountdown: true,
};

function withSvgIcons() {
    return applicationConfig({
        providers: [
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationSeveritySvgIconService(),
                }),
            },
        ],
    });
}

export const Standard: Story = {
    args: {
        ...SHARED_ARGS,
        description: 'Standard severity palette with the default Material Symbols font icons — colored backgrounds, white text.',
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
    ],
};

export const StandardActionButton: StoryObj<ActionButtonHarnessComponent> = {
    name: 'Standard (Action Button)',
    args: {
        ...DEFAULT_ACTION_ARGS,
        description: 'Action button: text, tonal, filled, outlined, elevated, icon-only, and icon + label variants. Use the Controls panel to tweak severity, action label, icon name, icon position, duration, and visibility flags before clicking any trigger. The action button is rendered between the message and the close button per the M3 snackbar anatomy. The "Last dismiss reason" surfaces the TbxMatNotificationDismissReason returned by the result promise.',
    },
    argTypes: ACTION_BUTTON_ARG_TYPES,
    render: (args) => ({
        props: args,
        template: `<tbx-action-button-harness
            [description]="description"
            [severity]="severity"
            [actionLabel]="actionLabel"
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
        ></tbx-action-button-harness>`,
    }),
    decorators: [
        moduleMetadata({ imports: [ActionButtonHarnessComponent] }),
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
        withActionProviders(),
    ],
};

export const StandardSvgIcons: Story = {
    name: 'Standard (SVG Icons)',
    args: {
        ...SHARED_ARGS,
        description: 'Standard severity palette with the default SVG icons shipped by @teqbench/tbx-mat-severity-theme (registered via TbxMatNotificationSeveritySvgIconService).',
    },
    argTypes: {
        ...SHARED_ARG_TYPES,
        iconAnimation: { table: { disable: true } },
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: false, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
};

export const Inverted: Story = {
    args: {
        ...SHARED_ARGS,
        description: 'Inverted severity palette — white backgrounds with colored text. Wired via provideTbxMatSeverityTheme({ invert: true }) at bootstrap. The inversion is app-global: banners and dialogs consuming the same shared theme invert simultaneously.',
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
    ],
};

export const InvertedSvgIcons: Story = {
    name: 'Inverted (SVG Icons)',
    args: {
        ...SHARED_ARGS,
        description: 'Inverted severity palette with the default SVG icons from @teqbench/tbx-mat-severity-theme.',
    },
    argTypes: {
        ...SHARED_ARG_TYPES,
        iconAnimation: { table: { disable: true } },
    },
    decorators: [
        applicationConfig({
            providers: [provideTbxMatSeverityTheme({ invert: true, applyToRoot: true })],
        }),
        withSvgIcons(),
    ],
};
