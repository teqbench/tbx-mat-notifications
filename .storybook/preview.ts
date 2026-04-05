import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../src/tokens/notification-provider-config.token';
import { TbxMatNotificationSeverityFontIconService } from '../src/services/notification-severity-font-icon.service';

// M3 prebuilt theme — provides typography, shape, and state-layer tokens.
// Without a theme, snackbar text, border-radius, and button ripples fall
// back to unstyled browser defaults. Azure Blue is used as a neutral
// baseline; it does not affect notification severity colors (those are
// driven by --tbx-mat-notification-* custom properties in the SCSS partial).
import '@angular/material/prebuilt-themes/azure-blue.css';

import '../src/styles/_tbx-mat-notifications.scss';

const preview: Preview = {
    decorators: [
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                {
                    provide: MAT_ICON_DEFAULT_OPTIONS,
                    useValue: { fontSet: 'material-symbols-rounded' },
                },
                {
                    provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                    useFactory: () => ({
                        severityIconResolverService: new TbxMatNotificationSeverityFontIconService(
                            'material-symbols-rounded'
                        ),
                    }),
                },
            ],
        }),
    ],
    parameters: {
        options: {
            storySort: {
                order: [
                    'Notifications',
                    [
                        'Default Font Icons',
                        'Filled Font Icons',
                        'State Transition Font Icons',
                        'Hover Fill Font Icons',
                        'Default SVG Icons',
                        'Custom Font Icons',
                        'Custom SVG Icons',
                        'Visibility',
                    ],
                ],
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
