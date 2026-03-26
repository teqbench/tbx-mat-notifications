import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { NOTIFICATION_ICON_SERVICE } from '../src/tokens/notification-icon-service.token';
import { NotificationIconService } from '../src/services/notification-icon.service';

// M3 prebuilt theme — provides typography, shape, and state-layer tokens.
// Without a theme, snackbar text, border-radius, and button ripples fall
// back to unstyled browser defaults. Azure Blue is used as a neutral
// baseline; it does not affect notification severity colors (those are
// driven by --tbx-notification-* custom properties in the SCSS partial).
import '@angular/material/prebuilt-themes/azure-blue.css';

import '../src/styles/_tbx-mat-notifications.scss';

const preview: Preview = {
    decorators: [
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                { provide: NOTIFICATION_ICON_SERVICE, useClass: NotificationIconService },
                {
                    provide: MAT_ICON_DEFAULT_OPTIONS,
                    useValue: { fontSet: 'material-symbols-rounded' },
                },
            ],
        }),
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
