import { describe, it, expect, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { NOTIFICATION_ICON_SERVICE } from '../tokens/notification-icon-service.token';
import { NotificationIconService } from '../services/notification-icon.service';
import { NotificationComponent } from './notification.component';
import { type NotificationData } from '../models/notification-data.model';
import { NOTIFICATION_DEFAULT_DURATION_MS } from '../constants/notification.constants';

function createFixture(data: NotificationData): ComponentFixture<NotificationComponent> {
    TestBed.configureTestingModule({
        imports: [NotificationComponent],
        providers: [
            { provide: MAT_SNACK_BAR_DATA, useValue: data },
            { provide: NOTIFICATION_ICON_SERVICE, useClass: NotificationIconService },
        ],
    });

    const fixture = TestBed.createComponent(NotificationComponent);
    fixture.detectChanges();
    return fixture;
}

/** Helper to build NotificationData with sensible defaults. */
function buildData(overrides: Partial<NotificationData> = {}): NotificationData {
    return {
        type: TbxMatSeverityLevelType.Information,
        message: 'Test',
        dismiss: vi.fn(),
        duration: NOTIFICATION_DEFAULT_DURATION_MS,
        showCountdown: false,
        ...overrides,
    };
}

/** Create a fixture without NOTIFICATION_ICON_SERVICE to test fallback icons. */
function createFixtureWithoutIconService(
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

describe('NotificationComponent', () => {
    describe('icon mapping via NOTIFICATION_ICON_SERVICE', () => {
        const cases: Array<[TbxMatSeverityLevelType, string]> = [
            [TbxMatSeverityLevelType.Success, 'check_circle'],
            [TbxMatSeverityLevelType.Error, 'error'],
            [TbxMatSeverityLevelType.Warning, 'warning_amber'],
            [TbxMatSeverityLevelType.Information, 'info'],
            [TbxMatSeverityLevelType.Help, 'help'],
        ];

        for (const [type, expectedIcon] of cases) {
            it(`should display "${expectedIcon}" icon for ${type}`, () => {
                const fixture = createFixture(buildData({ type }));

                const icon = fixture.debugElement.query(By.css('.tbx-snackbar-icon'));
                expect(icon.nativeElement.textContent.trim()).toBe(expectedIcon);
            });
        }
    });

    describe('fallback icons when NOTIFICATION_ICON_SERVICE is not provided', () => {
        const cases: Array<[TbxMatSeverityLevelType, string]> = [
            [TbxMatSeverityLevelType.Success, 'check_circle'],
            [TbxMatSeverityLevelType.Error, 'error'],
            [TbxMatSeverityLevelType.Warning, 'warning_amber'],
            [TbxMatSeverityLevelType.Information, 'info'],
            [TbxMatSeverityLevelType.Help, 'help'],
        ];

        for (const [type, expectedIcon] of cases) {
            it(`should fall back to "${expectedIcon}" for ${type}`, () => {
                const fixture = createFixtureWithoutIconService(buildData({ type }));

                const icon = fixture.debugElement.query(By.css('.tbx-snackbar-icon'));
                expect(icon.nativeElement.textContent.trim()).toBe(expectedIcon);
            });
        }
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

            const countdown = fixture.debugElement.query(By.css('.tbx-snackbar-countdown'));
            expect(countdown).toBeNull();
        });

        it('should render countdown bar when showCountdown is true', () => {
            const fixture = createFixture(buildData({ showCountdown: true }));

            const countdown = fixture.debugElement.query(By.css('.tbx-snackbar-countdown'));
            expect(countdown).not.toBeNull();
        });

        it('should set animation-duration to the provided duration', () => {
            const fixture = createFixture(buildData({ showCountdown: true, duration: 3000 }));

            const countdown = fixture.debugElement.query(By.css('.tbx-snackbar-countdown'));
            expect(countdown.nativeElement.style.animationDuration).toBe('3000ms');
        });
    });
});
