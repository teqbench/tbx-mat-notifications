import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTbxMatSeverityTheme } from '@teqbench/tbx-mat-severity-theme';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationSeverityFontIconService } from '../services/notification-severity-font-icon.service';
import { NotificationHarnessComponent, SHARED_ARG_TYPES, DEFAULT_ARGS, withDefaultProperties } from './notification.stories.common';

/**
 * Inverted severity story: white background, colored text per level.
 *
 * Demonstrates `provideTbxMatSeverityTheme({ invert: true })` from
 * `@teqbench/tbx-mat-severity-theme`. The helper toggles the
 * `tbx-mat-severity-inverted` class on `<html>` at bootstrap, flipping
 * every `--tbx-mat-severity-<level>-*` token pair. The effect is app-global —
 * banners and dialogs using the same shared theme invert simultaneously.
 */
function withInvertedSeverityTheme() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            provideTbxMatSeverityTheme({ invert: true }),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                }),
            },
        ],
    });
}

const meta: Meta<NotificationHarnessComponent> = {
    title: 'Notifications/Inverted Severity Theme',
    component: NotificationHarnessComponent,
    decorators: [moduleMetadata({ imports: [NotificationHarnessComponent] })],
    argTypes: SHARED_ARG_TYPES,
};

export default meta;
type Story = StoryObj<NotificationHarnessComponent>;

const DESCRIPTION = 'Inverted severity palette — white backgrounds with colored text. Wired via ' + 'provideTbxMatSeverityTheme({ invert: true }) at bootstrap. The inversion is app-global.';

export const Inverted: Story = {
    args: { ...DEFAULT_ARGS, description: DESCRIPTION },
    decorators: [withDefaultProperties(), withInvertedSeverityTheme()],
};
