import { Component, inject, Injectable, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MAT_ICON_DEFAULT_OPTIONS, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationSeverityFontIconService } from '../services/notification-severity-font-icon.service';
import { TbxMatNotificationSeveritySvgIconService } from '../services/notification-severity-svg-icon.service';
import { TbxMatNotificationService } from '../services/notification.service';

// ─── Custom Font Icon Service ────────────────────────────────────────────────
// Uses alternative Material Symbols ligatures to demonstrate icon overrides.

@Injectable()
class CustomFontIconService extends TbxMatNotificationSeverityFontIconService {
    protected override initialize(): void {
        super.initialize();
        this.register(TbxMatSeverityLevel.Success, 'task_alt');
        this.register(TbxMatSeverityLevel.Error, 'cancel');
        this.register(TbxMatSeverityLevel.Warning, 'warning');
        this.register(TbxMatSeverityLevel.Information, 'lightbulb');
        this.register(TbxMatSeverityLevel.Help, 'contact_support');
    }
}

// ─── Custom SVG Icon Service ─────────────────────────────────────────────────
// Overrides default SVGs with icons from the "Web 5" collection on SVG Repo.
// Source: https://www.svgrepo.com/collection/web-5/
// License: CC0 (no attribution required)

const CUSTOM_SVG_SUCCESS =
    '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><polygon style="fill:#FBB429;" points="256,22.23 317.195,191.236 501.801,200.815 363.092,304.447 407.913,489.77 256,371.251 104.087,489.77 149.929,304.447 10.2,200.815 195.825,191.236"/><g><path style="fill:#4D4D4D;" d="M104.085,499.969c-1.926,0-3.855-0.544-5.548-1.642c-3.648-2.366-5.395-6.785-4.351-11.007l44.21-178.729L4.124,209.006c-3.457-2.564-4.932-7.021-3.688-11.141c1.244-4.119,4.94-7.015,9.238-7.237l178.826-9.228l57.891-162.59c1.444-4.055,5.277-6.767,9.582-6.778c0.009,0,0.018,0,0.027,0c4.293,0,8.128,2.689,9.589,6.726l58.891,162.643l177.848,9.228c4.29,0.223,7.981,3.111,9.23,7.221c1.249,4.111-0.213,8.563-3.654,11.135L374.586,308.59l43.24,178.784c1.02,4.216-0.74,8.617-4.386,10.968s-8.381,2.14-11.801-0.53L256,384.187L110.361,497.812C108.524,499.245,106.308,499.969,104.085,499.969z M256,361.052c2.215,0,4.431,0.719,6.274,2.158l128.849,100.525l-37.945-156.891c-0.959-3.967,0.539-8.125,3.808-10.568l116.097-86.738l-156.418-8.117c-4.095-0.212-7.665-2.858-9.061-6.713L256.081,52.41l-50.647,142.247c-1.382,3.883-4.967,6.552-9.082,6.764l-157.269,8.117l116.923,86.717c3.305,2.451,4.813,6.648,3.825,10.642l-38.759,156.688l128.656-100.374C251.57,361.771,253.785,361.052,256,361.052z"/></g></svg>';

const CUSTOM_SVG_ERROR =
    '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><circle style="fill:#FF757C;" cx="256" cy="256" r="245.801"/><polygon style="fill:#F2F2F2;" points="395.561,164.038 347.961,116.44 256,208.401 164.039,116.44 116.439,164.038 208.401,256 116.439,347.962 164.039,395.56 256,303.599 347.961,395.56 395.561,347.962 303.599,256"/><g><path style="fill:#4D4D4D;" d="M256,512c-68.38,0-132.667-26.628-181.02-74.98S0,324.38,0,256S26.628,123.333,74.98,74.98S187.62,0,256,0s132.667,26.628,181.02,74.98S512,187.62,512,256s-26.628,132.667-74.98,181.02S324.38,512,256,512z M256,20.398C126.089,20.398,20.398,126.089,20.398,256S126.089,491.602,256,491.602S491.602,385.911,491.602,256S385.911,20.398,256,20.398z"/><path style="fill:#4D4D4D;" d="M347.962,405.759c-2.61,0-5.221-0.996-7.212-2.987L256,318.022l-84.749,84.75c-3.983,3.982-10.441,3.982-14.425,0l-47.599-47.599c-3.983-3.983-3.983-10.441,0-14.425L193.978,256l-84.75-84.749c-3.983-3.983-3.983-10.441,0-14.425l47.599-47.599c3.983-3.982,10.441-3.982,14.425,0L256,193.978l84.749-84.75c3.983-3.982,10.441-3.982,14.425,0l47.599,47.599c3.983,3.983,3.983,10.441,0,14.425L318.022,256l84.75,84.749c3.983,3.983,3.983,10.441,0,14.425l-47.599,47.599C353.182,404.764,350.572,405.759,347.962,405.759z M256,293.399c2.61,0,5.221,0.996,7.212,2.987l84.749,84.75l33.175-33.175l-84.75-84.749c-3.983-3.983-3.983-10.441,0-14.425l84.75-84.749l-33.175-33.175l-84.749,84.75c-3.983,3.982-10.441,3.982-14.425,0l-84.749-84.75l-33.175,33.175l84.75,84.749c3.983,3.983,3.983,10.441,0,14.425l-84.75,84.749l33.175,33.175l84.749-84.75C250.779,294.396,253.39,293.399,256,293.399z"/></g></svg>';

const CUSTOM_SVG_WARNING =
    '<svg viewBox="0 0 511.999 511.999" xmlns="http://www.w3.org/2000/svg"><polygon style="fill:#FBB429;" points="10.199,468.657 256,43.344 501.801,468.657"/><g><circle style="fill:#1FCFC1;" cx="256" cy="397.545" r="27.762"/><path style="fill:#1FCFC1;" d="M240.327,338.799h31.347c6.677,0,12.091-5.414,12.091-12.091V187.518c0-6.677-5.414-12.091-12.091-12.091h-31.347c-6.677,0-12.091,5.414-12.091,12.091v139.192C228.235,333.387,233.648,338.799,240.327,338.799z"/></g><g><path style="fill:#4D4D4D;" d="M501.801,478.856H10.199c-3.644,0-7.012-1.945-8.834-5.102c-1.822-3.157-1.821-7.046,0.003-10.201L247.169,38.239c1.823-3.154,5.188-5.096,8.83-5.096c3.642,0,7.008,1.942,8.83,5.096l245.801,425.314c1.824,3.156,1.825,7.045,0.003,10.201C508.813,476.912,505.445,478.856,501.801,478.856z M27.873,458.458h456.253L256,63.726L27.873,458.458z"/></g></svg>';

const CUSTOM_SVG_INFORMATION =
    '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><circle style="fill:#1FCFC1;" cx="256" cy="256" r="245.801"/><circle style="fill:#F2F2F2;" cx="256" cy="256" r="190.725"/><g><circle style="fill:#1FCFC1;" cx="256" cy="143.809" r="31.618"/><path style="fill:#1FCFC1;" d="M273.849,210.703h-35.697c-7.605,0-13.769,6.164-13.769,13.769V382.98c0,7.605,6.164,13.769,13.769,13.769h35.697c7.605,0,13.769-6.164,13.769-13.769V224.472C287.618,216.868,281.453,210.703,273.849,210.703z"/></g><g><path style="fill:#4D4D4D;" d="M256,512c-68.38,0-132.667-26.628-181.02-74.98S0,324.38,0,256S26.628,123.333,74.98,74.98S187.62,0,256,0s132.667,26.628,181.02,74.98S512,187.62,512,256s-26.628,132.667-74.98,181.02S324.38,512,256,512z M256,20.398C126.089,20.398,20.398,126.089,20.398,256S126.089,491.602,256,491.602S491.602,385.911,491.602,256S385.911,20.398,256,20.398z"/></g></svg>';

const CUSTOM_SVG_HELP =
    '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><circle style="fill:#1FCFC1;" cx="256.551" cy="470.479" r="31.323"/><path style="fill:#1FCFC1;" d="M256,401.786c-17.34,0-31.395-14.057-31.395-31.395v-97.04c0-17.34,14.057-31.395,31.395-31.395c46.584,0,84.482-37.898,84.482-84.482S302.584,72.991,256,72.991s-84.482,37.898-84.482,84.482c0,17.34-14.057,31.395-31.395,31.395s-31.395-14.057-31.395-31.395C108.727,76.266,174.793,10.199,256,10.199s147.273,66.066,147.273,147.273c0,70.437-49.702,129.482-115.878,143.906v69.013C287.395,387.731,273.34,401.786,256,401.786z"/></g><g><path style="fill:#4D4D4D;" d="M256.55,512c-22.895,0-41.522-18.627-41.522-41.522s18.627-41.522,41.522-41.522s41.522,18.627,41.522,41.522S279.445,512,256.55,512z"/><path style="fill:#4D4D4D;" d="M256,411.986c-22.935,0-41.594-18.659-41.594-41.594V273.35c0-22.935,18.659-41.594,41.594-41.594c40.96,0,74.284-33.323,74.284-74.284S296.96,83.189,256,83.189s-74.284,33.323-74.284,74.284c0,22.935-18.659,41.594-41.594,41.594s-41.594-18.659-41.594-41.594C98.527,70.642,169.169,0,256,0s157.473,70.642,157.473,157.473c0,36.106-12.579,71.41-35.42,99.404c-20.756,25.44-49.086,43.867-80.458,52.489v61.025C297.594,393.327,278.935,411.986,256,411.986z"/></g></svg>';

@Injectable()
class CustomSvgIconService extends TbxMatNotificationSeveritySvgIconService {
    protected override initialize(): void {
        super.initialize();
        this.register(TbxMatSeverityLevel.Success, CUSTOM_SVG_SUCCESS);
        this.register(TbxMatSeverityLevel.Error, CUSTOM_SVG_ERROR);
        this.register(TbxMatSeverityLevel.Warning, CUSTOM_SVG_WARNING);
        this.register(TbxMatSeverityLevel.Information, CUSTOM_SVG_INFORMATION);
        this.register(TbxMatSeverityLevel.Help, CUSTOM_SVG_HELP);
    }
}

// ─── Close Icon SVG ──────────────────────────────────────────────────────────
// Source: https://www.svgrepo.com/svg/208324/error-close
// License: CC0 (no attribution required)

const SVG_CLOSE =
    '<svg fill="#FFFFFF" opacity="0.4" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="M437.02,74.98C388.667,26.628,324.38,0,256,0S123.333,26.628,74.98,74.98C26.628,123.333,0,187.62,0,256s26.628,132.667,74.98,181.02C123.333,485.372,187.62,512,256,512s132.667-26.628,181.02-74.98C485.372,388.667,512,324.38,512,256S485.372,123.333,437.02,74.98z M256,491.602c-129.911,0-235.602-105.69-235.602-235.602S126.089,20.398,256,20.398S491.602,126.089,491.602,256S385.911,491.602,256,491.602z"/></g><g><path d="M318.022,256l84.75-84.749c3.983-3.984,3.983-10.442,0-14.425l-47.599-47.599c-3.984-3.982-10.442-3.982-14.425,0L256,193.978l-84.749-84.75c-3.984-3.982-10.442-3.982-14.425,0l-47.599,47.599c-3.983,3.984-3.983,10.442,0,14.425L193.978,256l-84.75,84.749c-3.983,3.984-3.983,10.442,0,14.425l47.599,47.599c3.984,3.982,10.442,3.982,14.425,0L256,318.022l84.75,84.749c1.991,1.991,4.602,2.987,7.212,2.987s5.22-0.995,7.212-2.986l47.599-47.599c3.983-3.984,3.983-10.442,0-14.425L318.022,256z"/></g></svg>';

const CLOSE_ICON_NAME = 'storybook-close';

// ─── Provider Decorators ─────────────────────────────────────────────────────

export function withDefaultFontIcons() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
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

export function withCustomFontIcons() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new CustomFontIconService(),
                }),
            },
        ],
    });
}

export function withDefaultSvgIcons() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationSeveritySvgIconService(),
                }),
            },
        ],
    });
}

export function withCustomSvgIcons() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new CustomSvgIconService(),
                }),
            },
        ],
    });
}

export function withCustomFontIconsAndFontClose() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new CustomFontIconService(),
                    closeIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => 'cancel',
                    },
                }),
            },
        ],
    });
}

export function withCustomSvgIconsAndSvgClose() {
    return applicationConfig({
        providers: [
            provideAnimationsAsync(),
            {
                provide: MAT_ICON_DEFAULT_OPTIONS,
                useValue: { fontSet: 'material-symbols-rounded' },
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => {
                    const registry = inject(MatIconRegistry);
                    const sanitizer = inject(DomSanitizer);
                    registry.addSvgIconLiteral(
                        CLOSE_ICON_NAME,
                        sanitizer.bypassSecurityTrustHtml(SVG_CLOSE)
                    );

                    return {
                        severityIconResolverService: new CustomSvgIconService(),
                        closeIconResolverService: {
                            iconType: TbxMatIconType.Svg,
                            resolve: () => CLOSE_ICON_NAME,
                        },
                    };
                },
            },
        ],
    });
}

// ─── CSS Custom Property Overrides ───────────────────────────────────────────

const STYLE_TAG_ID = 'tbx-notification-story-overrides';

function withCustomProperties(css: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (story: () => any) => {
        document.getElementById(STYLE_TAG_ID)?.remove();
        if (css) {
            const style = document.createElement('style');
            style.id = STYLE_TAG_ID;
            style.textContent = css;
            document.head.appendChild(style);
        }
        return story();
    };
}

export function withDefaultProperties() {
    return withCustomProperties('');
}

export const COMPACT_CSS = `
    html {
        --tbx-mat-notification-icon-size: 1.125rem;
        --tbx-mat-notification-font-size: 0.8125rem;
        --tbx-mat-notification-padding: 0.125rem;
        --tbx-mat-notification-label-gap: 0.5rem;
        --tbx-mat-notification-actions-padding: 0.5rem;
        --tbx-mat-notification-countdown-height: 0.125rem;
    }
`;

export const LARGE_CSS = `
    html {
        --tbx-mat-notification-icon-size: 3rem;
        --tbx-mat-notification-font-size: 2rem;
        --tbx-mat-notification-padding: 0.5rem;
        --tbx-mat-notification-label-gap: 2rem;
        --tbx-mat-notification-countdown-height: 0.25rem;
    }
`;

export const LARGE_ICON_ONLY_CSS = `
    html {
        --tbx-mat-notification-icon-size: 3rem;
    }
`;

// ─── Font Variation Settings ────────────────────────────────────────────────
// Material Symbols support the FILL axis (0 = outlined, 1 = filled).
// These CSS blocks target icons inside the snackbar container.

export const FILLED_CSS = `
    .mat-mdc-snack-bar-container .material-symbols-rounded {
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

export const STATE_TRANSITION_CSS = `
    @keyframes tbx-icon-fill {
        from { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        to   { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    }
    .mat-mdc-snack-bar-container .material-symbols-rounded {
        animation: tbx-icon-fill 0.3s ease-in-out 0.15s forwards;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

export const HOVER_FILL_CSS = `
    .mat-mdc-snack-bar-container .material-symbols-rounded {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        transition: font-variation-settings 0.3s ease-in-out;
    }
    .mat-mdc-snack-bar-container .material-symbols-rounded:hover {
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
`;

export { withCustomProperties };

// ─── Shared Args ─────────────────────────────────────────────────────────────

export const DEFAULT_ARGS = {
    horizontalPosition: 'start' as MatSnackBarHorizontalPosition,
    verticalPosition: 'bottom' as MatSnackBarVerticalPosition,
};

// ─── Harness Component ───────────────────────────────────────────────────────

@Component({
    selector: 'tbx-notification-harness',
    imports: [MatButtonModule],
    template: `
        <div class="harness">
            @if (description()) {
                <p class="story-description">{{ description() }}</p>
            }
            <p class="theme-note">
                Theme: Angular Material prebuilt <strong>Azure Blue</strong>. Notification severity
                colors are independent of the M3 theme palette.
            </p>
            <h3>Notification Triggers</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('success')">Success</button>
                <button mat-flat-button (click)="fire('error')">Error</button>
                <button mat-flat-button (click)="fire('warning')">Warning</button>
                <button mat-flat-button (click)="fire('information')">Information</button>
                <button mat-flat-button (click)="fire('help')">Help</button>
            </div>

            <h3>With Countdown</h3>
            <div class="button-group">
                <button mat-flat-button (click)="fire('success', true)">Success</button>
                <button mat-flat-button (click)="fire('error', true)">Error</button>
                <button mat-flat-button (click)="fire('warning', true)">Warning</button>
                <button mat-flat-button (click)="fire('information', true)">Information</button>
                <button mat-flat-button (click)="fire('help', true)">Help</button>
            </div>

            <h3>Queue Demo</h3>
            <div class="button-group">
                <button mat-flat-button (click)="queueDemo()">Fire 5 Queued</button>
                <button mat-flat-button (click)="notify.dismissAll()">Dismiss All</button>
            </div>
            <p class="state">
                Active: {{ notify.isActive() }} &middot; Pending: {{ notify.pendingCount() }}
            </p>
        </div>
    `,
    styles: `
        .harness {
            font-family: Roboto, sans-serif;
            padding: 1.5rem;
        }

        h3 {
            margin: 1.5rem 0 0.5rem;
        }

        h3:first-child {
            margin-top: 0;
        }

        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .theme-note {
            font-size: 0.8125rem;
            color: #888;
            border-left: 3px solid #ddd;
            padding: 0.25rem 0.75rem;
            margin: 0 0 1rem;
        }

        .state {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #666;
        }

        .story-description {
            font-size: 0.875rem;
            color: #333;
            background: #f0f4ff;
            border-left: 3px solid #1565c0;
            padding: 0.5rem 0.75rem;
            margin: 0 0 1rem;
            line-height: 1.4;
        }
    `,
})
export class NotificationHarnessComponent {
    readonly notify = inject(TbxMatNotificationService);
    readonly horizontalPosition = input<MatSnackBarHorizontalPosition>('start');
    readonly verticalPosition = input<MatSnackBarVerticalPosition>('bottom');
    readonly description = input<string>('');
    readonly showSeverityIcon = input<boolean>(true);
    readonly showCloseButton = input<boolean>(true);

    private readonly messages: Record<string, string> = {
        success: 'Operation completed successfully.',
        error: 'Something went wrong. Please try again.',
        warning: 'Your session will expire in 5 minutes.',
        information: 'A new version is available.',
        help: 'Click the + button to add a new item.',
    };

    fire(level: string, showCountdown = false): void {
        const method = this.notify[level as keyof TbxMatNotificationService] as (
            msg: string,
            args?: object
        ) => void;
        method.call(this.notify, this.messages[level], {
            showCountdown,
            showSeverityIcon: this.showSeverityIcon(),
            showCloseButton: this.showCloseButton(),
            snackBarConfig: {
                horizontalPosition: this.horizontalPosition(),
                verticalPosition: this.verticalPosition(),
            },
        });
    }

    queueDemo(): void {
        const args = {
            showCountdown: true,
            showSeverityIcon: this.showSeverityIcon(),
            showCloseButton: this.showCloseButton(),
            snackBarConfig: {
                horizontalPosition: this.horizontalPosition(),
                verticalPosition: this.verticalPosition(),
            },
        };

        this.notify.success('Step 1: Operation completed successfully.', args);
        this.notify.error('Step 2: Something went wrong.', args);
        this.notify.warning('Step 3: Review needed.', args);
        this.notify.information('Step 4: A new version is available.', args);
        this.notify.help('Step 5: Click the + button to add a new item.', args);
    }
}

// ─── Shared Meta ArgTypes ────────────────────────────────────────────────────

export const SHARED_ARG_TYPES = {
    horizontalPosition: {
        control: 'select',
        options: ['start', 'center', 'end', 'left', 'right'],
        description: 'Horizontal position of the snackbar',
    },
    verticalPosition: {
        control: 'select',
        options: ['top', 'bottom'],
        description: 'Vertical position of the snackbar',
    },
    showSeverityIcon: {
        control: 'boolean',
        description: 'Show the severity icon in the snackbar',
    },
    showCloseButton: {
        control: 'boolean',
        description: 'Show the close/dismiss button in the snackbar',
    },
} as const;
