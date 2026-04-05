import { describe, it, expect, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
    TbxMatIconType,
} from '@teqbench/tbx-mat-icons';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationSeverityFontIconService } from '../services/notification-severity-font-icon.service';
import { TbxMatNotificationComponent } from './notification.component';
import { type NotificationDataDto } from '../models/notification-data-dto.model';
import { NOTIFICATION_DEFAULT_DURATION_MS } from '../constants/notification.constants';
import { TbxMatNotificationIconPosition } from '../enums/notification-icon-position.enum';

const DUMMY_SVG = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>';

/** Register dummy SVG icons with MatIconRegistry so mat-icon doesn't log errors. */
function registerDummySvgIcons(...names: string[]): void {
    const registry = TestBed.inject(MatIconRegistry);
    const sanitizer = TestBed.inject(DomSanitizer);
    for (const name of names) {
        registry.addSvgIconLiteral(name, sanitizer.bypassSecurityTrustHtml(DUMMY_SVG));
    }
}

/** Create a fixture with the font icon provider config. */
function createFixture(data: NotificationDataDto): ComponentFixture<TbxMatNotificationComponent> {
    TestBed.configureTestingModule({
        imports: [TbxMatNotificationComponent],
        providers: [
            { provide: MAT_SNACK_BAR_DATA, useValue: data },
            {
                provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                }),
            },
        ],
    });

    const fixture = TestBed.createComponent(TbxMatNotificationComponent);
    fixture.detectChanges();
    return fixture;
}

/** Helper to build NotificationDataDto with sensible defaults. */
function buildData(overrides: Partial<NotificationDataDto> = {}): NotificationDataDto {
    return {
        type: TbxMatSeverityLevel.Information,
        message: 'Test',
        dismissByClose: vi.fn(),
        dismissByAction: vi.fn(),
        duration: NOTIFICATION_DEFAULT_DURATION_MS,
        showCountdown: false,
        showSeverityIcon: true,
        showCloseButton: true,
        closeIconResolverService: {
            iconType: TbxMatIconType.Font,
            resolve: () => 'close',
        },
        ...overrides,
    };
}

/** Create a fixture with a custom close icon resolver on the DTO. */
function createFixtureWithCloseIcon(
    data: NotificationDataDto
): ComponentFixture<TbxMatNotificationComponent> {
    TestBed.configureTestingModule({
        imports: [TbxMatNotificationComponent],
        providers: [
            { provide: MAT_SNACK_BAR_DATA, useValue: data },
            {
                provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                }),
            },
        ],
    });

    if (data.closeIconResolverService.iconType === TbxMatIconType.Svg) {
        const iconName = data.closeIconResolverService.resolve('close');
        if (iconName) {
            registerDummySvgIcons(iconName);
        }
    }

    const fixture = TestBed.createComponent(TbxMatNotificationComponent);
    fixture.detectChanges();
    return fixture;
}

/** Stub SVG resolver — iconType Svg tells the component to use svgIcon binding. */
const svgResolverStub = {
    iconType: TbxMatIconType.Svg,
    success: () => 'success',
    error: () => 'error',
    warning: () => 'warning',
    information: () => 'information',
    help: () => 'help',
    resolve: (name: string) => {
        const map: Record<string, string> = {
            [TbxMatSeverityLevel.Success]: 'success',
            [TbxMatSeverityLevel.Error]: 'error',
            [TbxMatSeverityLevel.Warning]: 'warning',
            [TbxMatSeverityLevel.Information]: 'information',
            [TbxMatSeverityLevel.Help]: 'help',
        };
        return map[name];
    },
};

/** Create a fixture with an SVG-based resolver config. */
function createFixtureWithSvgResolver(
    data: NotificationDataDto
): ComponentFixture<TbxMatNotificationComponent> {
    TestBed.configureTestingModule({
        imports: [TbxMatNotificationComponent],
        providers: [
            { provide: MAT_SNACK_BAR_DATA, useValue: data },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useValue: { severityIconResolverService: svgResolverStub },
            },
        ],
    });

    registerDummySvgIcons('success', 'error', 'warning', 'information', 'help');

    const fixture = TestBed.createComponent(TbxMatNotificationComponent);
    fixture.detectChanges();
    return fixture;
}

describe('TbxMatNotificationComponent', () => {
    describe('icon mapping via TBX_MAT_NOTIFICATION_PROVIDER_CONFIG', () => {
        const cases: Array<[TbxMatSeverityLevel, string]> = [
            [TbxMatSeverityLevel.Success, 'check_circle'],
            [TbxMatSeverityLevel.Error, 'error'],
            [TbxMatSeverityLevel.Warning, 'warning_amber'],
            [TbxMatSeverityLevel.Information, 'info'],
            [TbxMatSeverityLevel.Help, 'help'],
        ];

        for (const [type, expectedIcon] of cases) {
            it(`should display "${expectedIcon}" icon for ${type}`, () => {
                const fixture = createFixture(buildData({ type }));

                const icon = fixture.debugElement.query(
                    By.css('.tbx-mat-notification-snackbar-icon')
                );
                expect(icon.nativeElement.textContent.trim()).toBe(expectedIcon);
            });
        }
    });

    describe('SVG icon rendering via TBX_MAT_NOTIFICATION_PROVIDER_CONFIG', () => {
        it('should render svgIcon binding when resolver has no fontSet', () => {
            const fixture = createFixtureWithSvgResolver(
                buildData({ type: TbxMatSeverityLevel.Success })
            );

            const icon = fixture.debugElement.query(By.css('.tbx-mat-notification-snackbar-icon'));
            expect(icon.nativeElement.getAttribute('data-mat-icon-name')).toBe('success');
        });

        it('should return null from severityIconFont when resolver has no fontSet', () => {
            const fixture = createFixtureWithSvgResolver(
                buildData({ type: TbxMatSeverityLevel.Success })
            );

            const component = fixture.componentInstance;
            expect(component.severityIconFont()).toBeNull();
        });

        it('should not render font ligature text when using SVG resolver', () => {
            const fixture = createFixtureWithSvgResolver(
                buildData({ type: TbxMatSeverityLevel.Error })
            );

            const icon = fixture.debugElement.query(By.css('.tbx-mat-notification-snackbar-icon'));
            // SVG icons render via data-mat-icon-name attribute, not text content
            expect(icon.nativeElement.getAttribute('data-mat-icon-name')).toBe('error');
        });
    });

    describe('close icon', () => {
        it('should default to "close" font ligature when closeIcon is not configured', () => {
            const fixture = createFixture(buildData());

            const closeIcon = fixture.debugElement.query(
                By.css('.tbx-mat-notification-close-button mat-icon')
            );
            expect(closeIcon.nativeElement.textContent.trim()).toBe('close');
        });

        it('should use a custom font close icon when configured', () => {
            const fixture = createFixtureWithCloseIcon(
                buildData({
                    closeIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => 'cancel',
                    },
                })
            );

            const closeIcon = fixture.debugElement.query(
                By.css('.tbx-mat-notification-close-button mat-icon')
            );
            expect(closeIcon.nativeElement.textContent.trim()).toBe('cancel');
        });

        it('should use an SVG close icon when configured', () => {
            const fixture = createFixtureWithCloseIcon(
                buildData({
                    closeIconResolverService: {
                        iconType: TbxMatIconType.Svg,
                        resolve: () => 'my-close-svg',
                    },
                })
            );

            const closeIcon = fixture.debugElement.query(
                By.css('.tbx-mat-notification-close-button mat-icon')
            );
            expect(closeIcon.nativeElement.getAttribute('data-mat-icon-name')).toBe('my-close-svg');
        });

        it('should return null from closeIconFont when close icon is SVG', () => {
            const fixture = createFixtureWithCloseIcon(
                buildData({
                    closeIconResolverService: {
                        iconType: TbxMatIconType.Svg,
                        resolve: () => 'my-close-svg',
                    },
                })
            );

            const component = fixture.componentInstance;
            expect(component.closeIconFont()).toBeNull();
        });
    });

    describe('message', () => {
        it('should display the provided message', () => {
            const fixture = createFixture(buildData({ message: 'Hello world' }));

            const message = fixture.debugElement.query(By.css('[matSnackBarLabel] span'));
            expect(message.nativeElement.textContent.trim()).toBe('Hello world');
        });
    });

    describe('dismiss button', () => {
        it('should call dismissByClose when the close button is clicked', () => {
            const dismissByClose = vi.fn();
            const fixture = createFixture(buildData({ dismissByClose }));

            const closeButton = fixture.debugElement.query(
                By.css('.tbx-mat-notification-close-button')
            );
            closeButton.nativeElement.click();

            expect(dismissByClose).toHaveBeenCalledOnce();
        });

        it('should have an accessible aria-label', () => {
            const fixture = createFixture(buildData());

            const closeButton = fixture.debugElement.query(
                By.css('.tbx-mat-notification-close-button')
            );
            expect(closeButton.nativeElement.getAttribute('aria-label')).toBe(
                'Dismiss notification'
            );
        });
    });

    describe('severity icon visibility', () => {
        it('should render severity icon when showSeverityIcon is true', () => {
            const fixture = createFixture(buildData({ showSeverityIcon: true }));

            const icon = fixture.debugElement.query(By.css('.tbx-mat-notification-snackbar-icon'));
            expect(icon).not.toBeNull();
        });

        it('should not render severity icon when showSeverityIcon is false', () => {
            const fixture = createFixture(buildData({ showSeverityIcon: false }));

            const icon = fixture.debugElement.query(By.css('.tbx-mat-notification-snackbar-icon'));
            expect(icon).toBeNull();
        });

        it('should still display the message when severity icon is hidden', () => {
            const fixture = createFixture(
                buildData({ showSeverityIcon: false, message: 'No icon here' })
            );

            const message = fixture.debugElement.query(By.css('[matSnackBarLabel] span'));
            expect(message.nativeElement.textContent.trim()).toBe('No icon here');
        });
    });

    describe('close button visibility', () => {
        it('should render close button when showCloseButton is true', () => {
            const fixture = createFixture(buildData({ showCloseButton: true }));

            const closeButton = fixture.debugElement.query(
                By.css('.tbx-mat-notification-close-button')
            );
            expect(closeButton).not.toBeNull();
        });

        it('should not render close button when showCloseButton is false', () => {
            const fixture = createFixture(buildData({ showCloseButton: false }));

            const closeButton = fixture.debugElement.query(
                By.css('.tbx-mat-notification-close-button')
            );
            expect(closeButton).toBeNull();
        });

        it('should not render actions container when showCloseButton is false', () => {
            const fixture = createFixture(buildData({ showCloseButton: false }));

            const actions = fixture.debugElement.query(
                By.css('.tbx-mat-notification-snackbar-actions')
            );
            expect(actions).toBeNull();
        });

        it('should still display the message when close button is hidden', () => {
            const fixture = createFixture(
                buildData({ showCloseButton: false, message: 'No close button' })
            );

            const message = fixture.debugElement.query(By.css('[matSnackBarLabel] span'));
            expect(message.nativeElement.textContent.trim()).toBe('No close button');
        });
    });

    describe('countdown bar', () => {
        it('should not render countdown bar when showCountdown is false', () => {
            const fixture = createFixture(buildData({ showCountdown: false }));

            const countdown = fixture.debugElement.query(
                By.css('.tbx-mat-notification-snackbar-countdown')
            );
            expect(countdown).toBeNull();
        });

        it('should render countdown bar when showCountdown is true', () => {
            const fixture = createFixture(buildData({ showCountdown: true }));

            const countdown = fixture.debugElement.query(
                By.css('.tbx-mat-notification-snackbar-countdown')
            );
            expect(countdown).not.toBeNull();
        });

        it('should set animation-duration to the provided duration', () => {
            const fixture = createFixture(buildData({ showCountdown: true, duration: 3000 }));

            const countdown = fixture.debugElement.query(
                By.css('.tbx-mat-notification-snackbar-countdown')
            );
            expect(countdown.nativeElement.style.animationDuration).toBe('3000ms');
        });

        it('should not render countdown bar when duration is indefinite', () => {
            const fixture = createFixture(buildData({ showCountdown: true, duration: 0 }));

            const countdown = fixture.debugElement.query(
                By.css('.tbx-mat-notification-snackbar-countdown')
            );
            expect(countdown).toBeNull();
        });
    });

    describe('action button', () => {
        it('should render a text action button when actionLabel is set', () => {
            const fixture = createFixture(
                buildData({ actionLabel: 'Undo', actionButtonType: 'text' })
            );

            const actionButton = fixture.debugElement.query(By.css('button[mat-button]'));
            expect(actionButton).not.toBeNull();
            expect(actionButton.nativeElement.textContent.trim()).toContain('Undo');
        });

        it('should not render action button when actionLabel is not set', () => {
            const fixture = createFixture(buildData());

            const actionButton = fixture.debugElement.query(By.css('button[mat-button]'));
            expect(actionButton).toBeNull();
        });

        it('should call dismissByAction when action button is clicked', () => {
            const dismissByAction = vi.fn();
            const fixture = createFixture(
                buildData({ actionLabel: 'Retry', actionButtonType: 'text', dismissByAction })
            );

            const actionButton = fixture.debugElement.query(By.css('button[mat-button]'));
            actionButton.nativeElement.click();

            expect(dismissByAction).toHaveBeenCalledOnce();
        });

        it('should render an icon-only action button with aria-label', () => {
            const fixture = createFixture(
                buildData({
                    actionLabel: 'Refresh',
                    actionButtonType: 'icon',
                    actionIconName: 'refresh',
                    actionIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => 'refresh',
                    },
                })
            );

            const iconButton = fixture.debugElement.query(
                By.css('button[mat-icon-button][aria-label="Refresh"]')
            );
            expect(iconButton).not.toBeNull();
        });

        it('should render action icon font ligature', () => {
            const fixture = createFixture(
                buildData({
                    actionLabel: 'Retry',
                    actionButtonType: 'icon',
                    actionIconName: 'sync',
                    actionIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => 'sync',
                    },
                })
            );

            const component = fixture.componentInstance;
            expect(component.actionIconFont()).toBe('sync');
            expect(component.actionIconSvg()).toBeNull();
        });

        it('should resolve action icon SVG name', () => {
            const fixture = createFixture(
                buildData({
                    actionLabel: 'Retry',
                    actionButtonType: 'icon',
                    actionIconName: 'action-icon',
                    actionIconResolverService: {
                        iconType: TbxMatIconType.Svg,
                        resolve: () => 'action-icon',
                    },
                })
            );

            const component = fixture.componentInstance;
            expect(component.actionIconSvg()).toBe('action-icon');
            expect(component.actionIconFont()).toBeNull();
        });

        it('should return null from action icon signals when no resolver', () => {
            const fixture = createFixture(
                buildData({ actionLabel: 'Undo', actionButtonType: 'text' })
            );

            const component = fixture.componentInstance;
            expect(component.actionIconFont()).toBeNull();
            expect(component.actionIconSvg()).toBeNull();
        });

        it('should render a tonal action button with correct appearance', () => {
            const fixture = createFixture(
                buildData({ actionLabel: 'Retry', actionButtonType: 'tonal' })
            );

            const actionButton = fixture.debugElement.query(By.css('button[mat-button]'));
            expect(actionButton).not.toBeNull();
            expect(actionButton.nativeElement.textContent.trim()).toContain('Retry');
        });

        it('should render action icon when iconPosition is Before', () => {
            const fixture = createFixture(
                buildData({
                    actionLabel: 'Retry',
                    actionButtonType: 'tonal',
                    actionIconName: 'sync',
                    actionIconPosition: TbxMatNotificationIconPosition.Before,
                    actionIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => 'sync',
                    },
                })
            );

            const actionButton = fixture.debugElement.query(By.css('button[mat-button]'));
            expect(actionButton).not.toBeNull();
            const icon = actionButton.query(By.css('mat-icon'));
            expect(icon).not.toBeNull();
            expect(icon.nativeElement.textContent.trim()).toBe('sync');
        });

        it('should render action icon when iconPosition is After', () => {
            const fixture = createFixture(
                buildData({
                    actionLabel: 'View',
                    actionButtonType: 'outlined',
                    actionIconName: 'open_in_new',
                    actionIconPosition: TbxMatNotificationIconPosition.After,
                    actionIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => 'open_in_new',
                    },
                })
            );

            const actionButton = fixture.debugElement.query(By.css('button[mat-button]'));
            expect(actionButton).not.toBeNull();
            const icon = actionButton.query(By.css('mat-icon'));
            expect(icon).not.toBeNull();
            expect(icon.nativeElement.textContent.trim()).toBe('open_in_new');
        });
    });
});
