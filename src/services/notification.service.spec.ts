import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatNotificationService } from './notification.service';
import { NotificationComponent } from '../components/notification.component';
import {
    NOTIFICATION_DEFAULT_DURATION_MS,
    NOTIFICATION_MAX_DURATION_MS,
    NOTIFICATION_MIN_DURATION_MS,
} from '../constants/notification.constants';

describe('TbxMatNotificationService', () => {
    let service: TbxMatNotificationService;
    let snackBarSpy: {
        openFromComponent: ReturnType<typeof vi.fn>;
        dismiss: ReturnType<typeof vi.fn>;
    };

    /**
     * Subject that simulates MatSnackBarRef.afterDismissed().
     * Each call to openFromComponent returns a ref with this subject.
     * Call afterDismissed$.next() to simulate the snackbar being dismissed,
     * which triggers the queue to advance to the next notification.
     */
    let afterDismissed$: Subject<void>;

    beforeEach(() => {
        afterDismissed$ = new Subject<void>();

        snackBarSpy = {
            openFromComponent: vi.fn().mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
            }),
            dismiss: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [TbxMatNotificationService, { provide: MatSnackBar, useValue: snackBarSpy }],
        });

        service = TestBed.inject(TbxMatNotificationService);
    });

    describe('show()', () => {
        it('should open snackbar with NotificationComponent', () => {
            service.show({
                type: TbxMatSeverityLevelType.Success,
                message: 'Saved',
            });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
                NotificationComponent,
                expect.objectContaining({
                    data: expect.objectContaining({
                        type: TbxMatSeverityLevelType.Success,
                        message: 'Saved',
                    }),
                })
            );
        });

        it('should position snackbar at bottom-start', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.horizontalPosition).toBe('start');
            expect(config.verticalPosition).toBe('bottom');
        });

        it('should apply the correct panel class for each type', () => {
            const cases: Array<[TbxMatSeverityLevelType, string]> = [
                [TbxMatSeverityLevelType.Success, 'tbx-mat-notification-snackbar-success'],
                [TbxMatSeverityLevelType.Error, 'tbx-mat-notification-snackbar-error'],
                [TbxMatSeverityLevelType.Warning, 'tbx-mat-notification-snackbar-warning'],
                [TbxMatSeverityLevelType.Information, 'tbx-mat-notification-snackbar-info'],
                [TbxMatSeverityLevelType.Help, 'tbx-mat-notification-snackbar-help'],
            ];

            for (const [type, expectedClass] of cases) {
                snackBarSpy.openFromComponent.mockClear();

                // Dismiss previous so the next show() fires immediately
                afterDismissed$.next();
                afterDismissed$ = new Subject<void>();
                snackBarSpy.openFromComponent.mockReturnValue({
                    afterDismissed: () => afterDismissed$.asObservable(),
                });

                service.show({ type, message: 'test' });

                const config = snackBarSpy.openFromComponent.mock.calls[0][1];
                expect(config.panelClass).toBe(expectedClass);
            }
        });

        it('should use default duration when none is provided', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(NOTIFICATION_DEFAULT_DURATION_MS);
        });

        it('should use the provided duration when within range', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
                duration: 3000,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(3000);
        });

        it('should clamp duration to minimum', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
                duration: 100,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(NOTIFICATION_MIN_DURATION_MS);
        });

        it('should clamp duration to maximum', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
                duration: 99_000,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(NOTIFICATION_MAX_DURATION_MS);
        });

        it('should provide a dismiss callback in the data', () => {
            service.show({
                type: TbxMatSeverityLevelType.Success,
                message: 'Done',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            config.data.dismiss();

            expect(snackBarSpy.dismiss).toHaveBeenCalled();
        });

        it('should pass resolved duration in data for countdown animation', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
                duration: 3000,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.duration).toBe(3000);
        });

        it('should pass default duration in data when none is provided', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.duration).toBe(NOTIFICATION_DEFAULT_DURATION_MS);
        });
    });

    describe('showCountdown', () => {
        it('should default showCountdown to false', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showCountdown).toBe(false);
        });

        it('should pass showCountdown true when specified', () => {
            service.show({
                type: TbxMatSeverityLevelType.Information,
                message: 'Hello',
                showCountdown: true,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showCountdown).toBe(true);
        });

        it('should pass showCountdown via convenience methods', () => {
            service.success('Done', { showCountdown: true });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showCountdown).toBe(true);
        });
    });

    describe('queue', () => {
        it('should display the first notification immediately', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(1);
            expect(snackBarSpy.openFromComponent.mock.calls[0][1].data.message).toBe('First');
        });

        it('should not display a second notification until the first is dismissed', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevelType.Error, message: 'Second' });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(1);
            expect(snackBarSpy.openFromComponent.mock.calls[0][1].data.message).toBe('First');
        });

        it('should display the second notification after the first is dismissed', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevelType.Error, message: 'Second' });

            // Simulate first notification dismissed
            afterDismissed$.next();

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('Second');
        });

        it('should process multiple queued notifications in FIFO order', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevelType.Error, message: 'Second' });
            service.show({ type: TbxMatSeverityLevelType.Warning, message: 'Third' });

            // Set up fresh subject for the second notification BEFORE dismissing the first
            const secondDismissed$ = new Subject<void>();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => secondDismissed$.asObservable(),
            });

            // Dismiss first → second shows (using the mock we just set up)
            afterDismissed$.next();

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('Second');

            // Dismiss second → third shows
            secondDismissed$.next();

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(3);
            expect(snackBarSpy.openFromComponent.mock.calls[2][1].data.message).toBe('Third');
        });

        it('should report correct pendingCount', () => {
            expect(service.pendingCount()).toBe(0);

            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            // First is immediately shown (shifted off queue)
            expect(service.pendingCount()).toBe(0);

            service.show({ type: TbxMatSeverityLevelType.Error, message: 'Second' });
            expect(service.pendingCount()).toBe(1);

            service.show({ type: TbxMatSeverityLevelType.Warning, message: 'Third' });
            expect(service.pendingCount()).toBe(2);
        });

        it('should accept new notifications after queue drains', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            afterDismissed$.next();

            // Queue is empty, service should accept new notifications
            afterDismissed$ = new Subject<void>();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
            });

            service.show({ type: TbxMatSeverityLevelType.Error, message: 'New' });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('New');
        });
    });

    describe('dismiss()', () => {
        it('should call snackBar.dismiss()', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'Test' });
            service.dismiss();
            expect(snackBarSpy.dismiss).toHaveBeenCalled();
        });

        it('should advance to the next queued notification', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevelType.Error, message: 'Second' });

            service.dismiss();
            // Simulate dismiss completing
            afterDismissed$.next();

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('Second');
        });
    });

    describe('dismissAll()', () => {
        it('should dismiss the current notification', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'Test' });
            service.dismissAll();

            expect(snackBarSpy.dismiss).toHaveBeenCalled();
        });

        it('should clear the queue so no further notifications show', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevelType.Error, message: 'Second' });
            service.show({ type: TbxMatSeverityLevelType.Warning, message: 'Third' });

            service.dismissAll();

            expect(service.pendingCount()).toBe(0);
            // Only the first notification was ever displayed
            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(1);
        });

        it('should allow new notifications after dismissAll', () => {
            service.show({ type: TbxMatSeverityLevelType.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevelType.Error, message: 'Queued' });

            service.dismissAll();

            // Reset mock for clean assertion
            afterDismissed$ = new Subject<void>();
            snackBarSpy.openFromComponent.mockClear();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
            });

            service.show({ type: TbxMatSeverityLevelType.Help, message: 'Fresh' });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(1);
            expect(snackBarSpy.openFromComponent.mock.calls[0][1].data.message).toBe('Fresh');
        });

        it('should handle dismissAll when no notification is active', () => {
            service.dismissAll();
            expect(service.pendingCount()).toBe(0);
            expect(service.isActive()).toBe(false);
        });
    });

    describe('convenience methods', () => {
        it('success() should show a Success notification', () => {
            service.success('Saved');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevelType.Success);
            expect(config.data.message).toBe('Saved');
        });

        it('error() should show an Error notification', () => {
            service.error('Failed');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevelType.Error);
            expect(config.data.message).toBe('Failed');
        });

        it('warn() should show a Warning notification', () => {
            service.warn('Careful');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevelType.Warning);
            expect(config.data.message).toBe('Careful');
        });

        it('info() should show an Information notification', () => {
            service.info('FYI');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevelType.Information);
            expect(config.data.message).toBe('FYI');
        });

        it('help() should show a Help notification', () => {
            service.help('Try this');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevelType.Help);
            expect(config.data.message).toBe('Try this');
        });

        it('convenience methods should accept optional configArgs', () => {
            service.success('Done', { duration: 2000 });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(2000);
        });
    });
});
