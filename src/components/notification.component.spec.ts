import { describe, it, expect, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { TbxSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
} from '@teqbench/tbx-mat-icons';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { TbxMatNotificationFontIconService } from '../services/notification-font-icon.service';
import { NotificationComponent } from './notification.component';
import { type NotificationData } from '../models/notification-data.model';
import { NOTIFICATION_DEFAULT_DURATION_MS } from '../constants/notification.constants';

/** Create a fixture with the font icon provider config. */
function createFixture(data: NotificationData): ComponentFixture<NotificationComponent> {
    TestBed.configureTestingModule({
        imports: [NotificationComponent],
        providers: [
            { provide: MAT_SNACK_BAR_DATA, useValue: data },
            {
                provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationFontIconService(),
                }),
            },
        ],
    });

    const fixture = TestBed.createComponent(NotificationComponent);
    fixture.detectChanges();
    return fixture;
}

/** Helper to build NotificationData with sensible defaults. */
function buildData(overrides: Partial<NotificationData> = {}): NotificationData {
    return {
        type: TbxSeverityLevelType.Information,
        message: 'Test',
        dismiss: vi.fn(),
        duration: NOTIFICATION_DEFAULT_DURATION_MS,
        showCountdown: false,
        ...overrides,
    };
}

/** Create a fixture without TBX_MAT_NOTIFICATION_PROVIDER_CONFIG to test fallback icons. */
function createFixtureWithoutConfig(
    data: NotificationData
): ComponentFixture<NotificationComponent> {
    TestBed.configureTestingModule({
        imports: [NotificationComponent],
        providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: data }],
    });

    const fixture = TestBed.createComponent(NotificationComponent);
    fixture.detectChanges();
    return fixture;
}

/** Create a fixture with a custom close icon config. */
function createFixtureWithCloseIcon(
    data: NotificationData,
    closeIcon: { name: string; type: 'font' | 'svg' }
): ComponentFixture<NotificationComponent> {
    TestBed.configureTestingModule({
        imports: [NotificationComponent],
        providers: [
            { provide: MAT_SNACK_BAR_DATA, useValue: data },
            {
                provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
            },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useFactory: () => ({
                    severityIconResolverService: new TbxMatNotificationFontIconService(),
                    closeIcon,
                }),
            },
        ],
    });

    const fixture = TestBed.createComponent(NotificationComponent);
    fixture.detectChanges();
    return fixture;
}

/** Stub SVG resolver — no fontSet property, so component detects it as SVG-based. */
const svgResolverStub = {
    success: () => 'svg-success',
    error: () => 'svg-error',
    warning: () => 'svg-warning',
    information: () => 'svg-info',
    help: () => 'svg-help',
    resolve: (name: string) => {
        const map: Record<string, string> = {
            success: 'svg-success',
            error: 'svg-error',
            warning: 'svg-warning',
            information: 'svg-info',
            help: 'svg-help',
        };
        return map[name];
    },
};

/** Create a fixture with an SVG-based resolver config. */
function createFixtureWithSvgResolver(
    data: NotificationData
): ComponentFixture<NotificationComponent> {
    TestBed.configureTestingModule({
        imports: [NotificationComponent],
        providers: [
            { provide: MAT_SNACK_BAR_DATA, useValue: data },
            {
                provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                useValue: { severityIconResolverService: svgResolverStub },
            },
        ],
    });

    const fixture = TestBed.createComponent(NotificationComponent);
    fixture.detectChanges();
    return fixture;
}

describe('NotificationComponent', () => {
    describe('icon mapping via TBX_MAT_NOTIFICATION_PROVIDER_CONFIG', () => {
        const cases: Array<[TbxSeverityLevelType, string]> = [
            [TbxSeverityLevelType.Success, 'check_circle'],
            [TbxSeverityLevelType.Error, 'error'],
            [TbxSeverityLevelType.Warning, 'warning_amber'],
            [TbxSeverityLevelType.Information, 'info'],
            [TbxSeverityLevelType.Help, 'help'],
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
                buildData({ type: TbxSeverityLevelType.Success })
            );

            const icon = fixture.debugElement.query(By.css('.tbx-mat-notification-snackbar-icon'));
            expect(icon.nativeElement.getAttribute('data-mat-icon-name')).toBe('svg-success');
        });

        it('should return null from severityIconFont when resolver has no fontSet', () => {
            const fixture = createFixtureWithSvgResolver(
                buildData({ type: TbxSeverityLevelType.Success })
            );

            const component = fixture.componentInstance;
            expect(component.severityIconFont()).toBeNull();
        });

        it('should not render font ligature text when using SVG resolver', () => {
            const fixture = createFixtureWithSvgResolver(
                buildData({ type: TbxSeverityLevelType.Error })
            );

            const icon = fixture.debugElement.query(By.css('.tbx-mat-notification-snackbar-icon'));
            // SVG icons render via data-mat-icon-name attribute, not text content
            expect(icon.nativeElement.getAttribute('data-mat-icon-name')).toBe('svg-error');
        });
    });

    describe('fallback icons when TBX_MAT_NOTIFICATION_PROVIDER_CONFIG is not provided', () => {
        const cases: Array<[TbxSeverityLevelType, string]> = [
            [TbxSeverityLevelType.Success, 'check_circle'],
            [TbxSeverityLevelType.Error, 'error'],
            [TbxSeverityLevelType.Warning, 'warning_amber'],
            [TbxSeverityLevelType.Information, 'info'],
            [TbxSeverityLevelType.Help, 'help'],
        ];

        for (const [type, expectedIcon] of cases) {
            it(`should fall back to "${expectedIcon}" for ${type}`, () => {
                const fixture = createFixtureWithoutConfig(buildData({ type }));

                const icon = fixture.debugElement.query(
                    By.css('.tbx-mat-notification-snackbar-icon')
                );
                expect(icon.nativeElement.textContent.trim()).toBe(expectedIcon);
            });
        }
    });

    describe('close icon', () => {
        it('should default to "close" font ligature when closeIcon is not configured', () => {
            const fixture = createFixture(buildData());

            const closeIcon = fixture.debugElement.query(By.css('button[matIconButton] mat-icon'));
            expect(closeIcon.nativeElement.textContent.trim()).toBe('close');
        });

        it('should use a custom font close icon when configured', () => {
            const fixture = createFixtureWithCloseIcon(buildData(), {
                name: 'cancel',
                type: 'font',
            });

            const closeIcon = fixture.debugElement.query(By.css('button[matIconButton] mat-icon'));
            expect(closeIcon.nativeElement.textContent.trim()).toBe('cancel');
        });

        it('should use an SVG close icon when configured', () => {
            const fixture = createFixtureWithCloseIcon(buildData(), {
                name: 'my-close-svg',
                type: 'svg',
            });

            const closeIcon = fixture.debugElement.query(By.css('button[matIconButton] mat-icon'));
            expect(closeIcon.nativeElement.getAttribute('data-mat-icon-name')).toBe('my-close-svg');
        });

        it('should return null from closeIconFont when close icon is SVG', () => {
            const fixture = createFixtureWithCloseIcon(buildData(), {
                name: 'my-close-svg',
                type: 'svg',
            });

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
        it('should call dismiss when the close button is clicked', () => {
            const dismiss = vi.fn();
            const fixture = createFixture(buildData({ dismiss }));

            const closeButton = fixture.debugElement.query(By.css('button[matIconButton]'));
            closeButton.nativeElement.click();

            expect(dismiss).toHaveBeenCalledOnce();
        });

        it('should have an accessible aria-label', () => {
            const fixture = createFixture(buildData());

            const closeButton = fixture.debugElement.query(By.css('button[matIconButton]'));
            expect(closeButton.nativeElement.getAttribute('aria-label')).toBe(
                'Dismiss notification'
            );
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
    });
});
