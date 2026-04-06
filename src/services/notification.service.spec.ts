import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED, TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatNotificationService } from './notification.service';
import { TbxMatNotificationSeverityFontIconService } from './notification-severity-font-icon.service';
import { TbxMatNotificationComponent } from '../components/notification.component';
import { TBX_MAT_NOTIFICATION_PROVIDER_CONFIG } from '../tokens/notification-provider-config.token';
import { NOTIFICATION_DEFAULT_DURATION_MS } from '../constants/notification.constants';
import { TbxMatNotificationDismissReason } from '../enums/notification-dismiss-reason.enum';

describe('TbxMatNotificationService', () => {
    let service: TbxMatNotificationService;
    let snackBarSpy: {
        openFromComponent: ReturnType<typeof vi.fn>;
        dismiss: ReturnType<typeof vi.fn>;
    };

    /**
     * Subject that simulates MatSnackBarRef.afterDismissed().
     * Each call to openFromComponent returns a ref with this subject.
     * Call `afterDismissed$.next()` with `dismissedByAction: false` to
     * simulate dismissal by timeout or close. Use `dismissedByAction: true`
     * to simulate action button dismissal.
     */
    let afterDismissed$: Subject<{ dismissedByAction: boolean }>;

    beforeEach(() => {
        afterDismissed$ = new Subject<{ dismissedByAction: boolean }>();

        snackBarSpy = {
            openFromComponent: vi.fn().mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
                dismiss: vi.fn(),
                dismissWithAction: vi.fn(),
            }),
            dismiss: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                TbxMatNotificationService,
                { provide: MatSnackBar, useValue: snackBarSpy },
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

        service = TestBed.inject(TbxMatNotificationService);
    });

    describe('show()', () => {
        it('should open snackbar with TbxMatNotificationComponent', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Saved',
            });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
                TbxMatNotificationComponent,
                expect.objectContaining({
                    data: expect.objectContaining({
                        type: TbxMatSeverityLevel.Success,
                        message: 'Saved',
                    }),
                })
            );
        });

        it('should apply the correct panel class for each type', () => {
            const cases: Array<[TbxMatSeverityLevel, string]> = [
                [TbxMatSeverityLevel.Default, 'tbx-mat-notification-snackbar-default'],
                [TbxMatSeverityLevel.Success, 'tbx-mat-notification-snackbar-success'],
                [TbxMatSeverityLevel.Error, 'tbx-mat-notification-snackbar-error'],
                [TbxMatSeverityLevel.Warning, 'tbx-mat-notification-snackbar-warning'],
                [TbxMatSeverityLevel.Information, 'tbx-mat-notification-snackbar-info'],
                [TbxMatSeverityLevel.Help, 'tbx-mat-notification-snackbar-help'],
            ];

            for (const [type, expectedClass] of cases) {
                snackBarSpy.openFromComponent.mockClear();

                // Dismiss previous so the next show() fires immediately
                afterDismissed$.next({ dismissedByAction: false });
                afterDismissed$ = new Subject<{ dismissedByAction: boolean }>();
                snackBarSpy.openFromComponent.mockReturnValue({
                    afterDismissed: () => afterDismissed$.asObservable(),
                    dismiss: vi.fn(),
                    dismissWithAction: vi.fn(),
                });

                service.show({ type, message: 'test' });

                const config = snackBarSpy.openFromComponent.mock.calls[0][1];
                expect(config.panelClass).toContain(expectedClass);
            }
        });

        it('should use default duration when none is provided', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(NOTIFICATION_DEFAULT_DURATION_MS);
        });

        it('should use the provided duration as-is when positive', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
                duration: 30_000,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(30_000);
        });

        it('should treat duration <= 0 as indefinite (0)', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
                duration: 0,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(0);
        });

        it('should treat negative duration as indefinite (0)', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
                duration: -500,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(0);
        });

        it('should provide dismissByClose and dismissByAction callbacks in the data', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Done',
            });

            const mockRef = snackBarSpy.openFromComponent.mock.results[0].value;
            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            config.data.dismissByClose();

            expect(mockRef.dismiss).toHaveBeenCalled();
        });

        it('should pass resolved duration in data for countdown animation', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
                duration: 3000,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.duration).toBe(3000);
        });

        it('should pass default duration in data when none is provided', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.duration).toBe(NOTIFICATION_DEFAULT_DURATION_MS);
        });
    });

    describe('showCountdown', () => {
        it('should default showCountdown to false', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showCountdown).toBe(false);
        });

        it('should pass showCountdown true when specified', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
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

    describe('showSeverityIcon', () => {
        it('should default showSeverityIcon to true', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showSeverityIcon).toBe(true);
        });

        it('should pass showSeverityIcon false when specified', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
                showSeverityIcon: false,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showSeverityIcon).toBe(false);
        });

        it('should pass showSeverityIcon via convenience methods', () => {
            service.success('Done', { showSeverityIcon: false });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showSeverityIcon).toBe(false);
        });
    });

    describe('showCloseButton', () => {
        it('should default showCloseButton to true', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showCloseButton).toBe(true);
        });

        it('should pass showCloseButton false when specified', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Hello',
                showCloseButton: false,
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showCloseButton).toBe(false);
        });

        it('should pass showCloseButton via convenience methods', () => {
            service.success('Done', { showCloseButton: false });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.showCloseButton).toBe(false);
        });
    });

    describe('queue', () => {
        it('should display the first notification immediately', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(1);
            expect(snackBarSpy.openFromComponent.mock.calls[0][1].data.message).toBe('First');
        });

        it('should not display a second notification until the first is dismissed', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(1);
            expect(snackBarSpy.openFromComponent.mock.calls[0][1].data.message).toBe('First');
        });

        it('should display the second notification after the first is dismissed', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });

            // Simulate first notification dismissed
            afterDismissed$.next({ dismissedByAction: false });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('Second');
        });

        it('should process multiple queued notifications in FIFO order', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });
            service.show({ type: TbxMatSeverityLevel.Warning, message: 'Third' });

            // Set up fresh subject for the second notification BEFORE dismissing the first
            const secondDismissed$ = new Subject<{ dismissedByAction: boolean }>();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => secondDismissed$.asObservable(),
                dismiss: vi.fn(),
                dismissWithAction: vi.fn(),
            });

            // Dismiss first → second shows (using the mock we just set up)
            afterDismissed$.next({ dismissedByAction: false });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('Second');

            // Dismiss second → third shows
            secondDismissed$.next({ dismissedByAction: false });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(3);
            expect(snackBarSpy.openFromComponent.mock.calls[2][1].data.message).toBe('Third');
        });

        it('should report correct pendingCount', () => {
            expect(service.pendingCount()).toBe(0);

            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            // First is immediately shown (shifted off queue)
            expect(service.pendingCount()).toBe(0);

            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });
            expect(service.pendingCount()).toBe(1);

            service.show({ type: TbxMatSeverityLevel.Warning, message: 'Third' });
            expect(service.pendingCount()).toBe(2);
        });

        it('should accept new notifications after queue drains', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            afterDismissed$.next({ dismissedByAction: false });

            // Queue is empty, service should accept new notifications
            afterDismissed$ = new Subject<{ dismissedByAction: boolean }>();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
                dismiss: vi.fn(),
                dismissWithAction: vi.fn(),
            });

            service.show({ type: TbxMatSeverityLevel.Error, message: 'New' });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('New');
        });
    });

    describe('dismiss()', () => {
        it('should call snackBar.dismiss()', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            service.dismiss();
            expect(snackBarSpy.dismiss).toHaveBeenCalled();
        });

        it('should advance to the next queued notification', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });

            service.dismiss();
            // Simulate dismiss completing
            afterDismissed$.next({ dismissedByAction: false });

            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(2);
            expect(snackBarSpy.openFromComponent.mock.calls[1][1].data.message).toBe('Second');
        });
    });

    describe('dismissAll()', () => {
        it('should dismiss the current notification', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'Test' });
            service.dismissAll();

            expect(snackBarSpy.dismiss).toHaveBeenCalled();
        });

        it('should clear the queue so no further notifications show', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Second' });
            service.show({ type: TbxMatSeverityLevel.Warning, message: 'Third' });

            service.dismissAll();

            expect(service.pendingCount()).toBe(0);
            // Only the first notification was ever displayed
            expect(snackBarSpy.openFromComponent).toHaveBeenCalledTimes(1);
        });

        it('should allow new notifications after dismissAll', () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            service.show({ type: TbxMatSeverityLevel.Error, message: 'Queued' });

            service.dismissAll();

            // Reset mock for clean assertion
            afterDismissed$ = new Subject<{ dismissedByAction: boolean }>();
            snackBarSpy.openFromComponent.mockClear();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
                dismiss: vi.fn(),
                dismissWithAction: vi.fn(),
            });

            service.show({ type: TbxMatSeverityLevel.Help, message: 'Fresh' });

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
            expect(config.data.type).toBe(TbxMatSeverityLevel.Success);
            expect(config.data.message).toBe('Saved');
        });

        it('error() should show an Error notification', () => {
            service.error('Failed');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevel.Error);
            expect(config.data.message).toBe('Failed');
        });

        it('warning() should show a Warning notification', () => {
            service.warning('Careful');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevel.Warning);
            expect(config.data.message).toBe('Careful');
        });

        it('information() should show an Information notification', () => {
            service.information('FYI');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevel.Information);
            expect(config.data.message).toBe('FYI');
        });

        it('help() should show a Help notification', () => {
            service.help('Try this');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevel.Help);
            expect(config.data.message).toBe('Try this');
        });

        it('default() should show a Default notification', () => {
            service.default('General');

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.data.type).toBe(TbxMatSeverityLevel.Default);
            expect(config.data.message).toBe('General');
        });

        it('convenience methods should accept optional configArgs', () => {
            service.success('Done', { duration: 2000 });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.duration).toBe(2000);
        });
    });

    describe('TbxMatNotificationRef return type', () => {
        it('should return a ref with the consumer config', () => {
            const inputConfig = {
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
            };
            const ref = service.show(inputConfig);

            expect(ref.config).toBe(inputConfig);
        });

        it('should resolve snackBarRef when notification displays', async () => {
            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
            });

            const snackBarRef = await ref.snackBarRef;
            expect(snackBarRef).toBeTruthy();
            expect(snackBarRef).toBe(snackBarSpy.openFromComponent.mock.results[0].value);
        });

        it('should resolve snackBarRef with null when cleared by dismissAll', async () => {
            // Show first to make service active
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });

            // Queue second (not yet displayed)
            const ref = service.show({
                type: TbxMatSeverityLevel.Error,
                message: 'Queued',
            });

            service.dismissAll();

            const snackBarRef = await ref.snackBarRef;
            expect(snackBarRef).toBeNull();
        });

        it('should return ref from convenience methods', () => {
            const ref = service.success('Test');

            expect(ref).toBeDefined();
            expect(ref.config.type).toBe(TbxMatSeverityLevel.Success);
            expect(ref.config.message).toBe('Test');
        });
    });

    describe('dismiss reasons', () => {
        it('should resolve with Timeout when auto-dismissed by duration', async () => {
            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
            });

            afterDismissed$.next({ dismissedByAction: false });

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatNotificationDismissReason.Timeout);
        });

        it('should resolve with Action when action button is clicked', async () => {
            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
            });

            afterDismissed$.next({ dismissedByAction: true });

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatNotificationDismissReason.Action);
        });

        it('should resolve with Close when close button is clicked', async () => {
            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
            });

            // Simulate close button click via the DTO callback
            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            data.dismissByClose();

            afterDismissed$.next({ dismissedByAction: false });

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatNotificationDismissReason.Close);
        });

        it('should resolve with ProgrammaticDismissCurrent when dismiss() is called', async () => {
            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
            });

            service.dismiss();
            afterDismissed$.next({ dismissedByAction: false });

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatNotificationDismissReason.ProgrammaticDismissCurrent);
        });

        it('should resolve with ProgrammaticDismissAll for active notification', async () => {
            const ref = service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
            });

            service.dismissAll();

            const result = await ref.result;
            expect(result.dismissReason).toBe(TbxMatNotificationDismissReason.ProgrammaticDismissAll);
        });

        it('should resolve with ProgrammaticDismissAll for queued notifications', async () => {
            service.show({ type: TbxMatSeverityLevel.Success, message: 'First' });
            const ref2 = service.show({
                type: TbxMatSeverityLevel.Error,
                message: 'Second',
            });
            const ref3 = service.show({
                type: TbxMatSeverityLevel.Warning,
                message: 'Third',
            });

            service.dismissAll();

            const result2 = await ref2.result;
            const result3 = await ref3.result;
            expect(result2.dismissReason).toBe(TbxMatNotificationDismissReason.ProgrammaticDismissAll);
            expect(result3.dismissReason).toBe(TbxMatNotificationDismissReason.ProgrammaticDismissAll);
        });
    });

    describe('snackBarConfig passthrough', () => {
        it('should pass through native config properties', () => {
            service.show({
                type: TbxMatSeverityLevel.Information,
                message: 'Test',
                snackBarConfig: {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                },
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.horizontalPosition).toBe('center');
            expect(config.verticalPosition).toBe('top');
        });

        it('should merge consumer panelClass with severity class', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                snackBarConfig: {
                    panelClass: 'my-custom-class',
                },
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.panelClass).toContain('tbx-mat-notification-snackbar-success');
            expect(config.panelClass).toContain('my-custom-class');
        });

        it('should merge consumer panelClass array with severity class', () => {
            service.show({
                type: TbxMatSeverityLevel.Error,
                message: 'Test',
                snackBarConfig: {
                    panelClass: ['class-a', 'class-b'],
                },
            });

            const config = snackBarSpy.openFromComponent.mock.calls[0][1];
            expect(config.panelClass).toContain('tbx-mat-notification-snackbar-error');
            expect(config.panelClass).toContain('class-a');
            expect(config.panelClass).toContain('class-b');
        });
    });

    describe('action resolution', () => {
        it('should set action fields on DTO when action is provided', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Deleted',
                action: { label: 'Undo' },
            });

            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            expect(data.actionLabel).toBe('Undo');
            expect(data.actionButtonType).toBe('text');
        });

        it('should not set action fields when no action is provided', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Saved',
            });

            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            expect(data.actionLabel).toBeUndefined();
        });

        it('should fallback icon button type to text when iconName is missing', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                action: { label: 'Retry', actionButtonType: 'icon' },
            });

            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            expect(data.actionButtonType).toBe('text');
        });

        it('should not include action icon fields for text buttons with iconName', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                action: {
                    label: 'Retry',
                    iconName: 'refresh',
                    actionButtonType: 'text',
                },
            });

            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            expect(data.actionButtonType).toBe('text');
            expect(data.actionIconName).toBeUndefined();
        });

        it('should log error and skip action when icon resolver is missing', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                action: {
                    label: 'Retry',
                    iconName: 'refresh',
                    actionButtonType: 'icon',
                    actionIconResolverService: {
                        iconType: TbxMatIconType.Font,
                        resolve: () => 'refresh',
                    },
                },
            });

            // With resolver provided, action should be set
            const data1 = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            expect(data1.actionLabel).toBe('Retry');

            // Without resolver, action should be skipped
            afterDismissed$.next({ dismissedByAction: false });
            afterDismissed$ = new Subject<{ dismissedByAction: boolean }>();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
                dismiss: vi.fn(),
                dismissWithAction: vi.fn(),
            });

            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test2',
                action: {
                    label: 'Retry',
                    iconName: 'refresh',
                    actionButtonType: 'filled',
                },
            });

            expect(consoleSpy).toHaveBeenCalled();
            const data2 = snackBarSpy.openFromComponent.mock.calls[1][1].data;
            expect(data2.actionLabel).toBeUndefined();

            consoleSpy.mockRestore();
        });
    });

    describe('provider-level action config cascade', () => {
        it('should use provider actionButtonType when per-notification is not set', () => {
            TestBed.resetTestingModule();
            afterDismissed$ = new Subject<{ dismissedByAction: boolean }>();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
                dismiss: vi.fn(),
                dismissWithAction: vi.fn(),
            });

            TestBed.configureTestingModule({
                providers: [
                    TbxMatNotificationService,
                    { provide: MatSnackBar, useValue: snackBarSpy },
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                        useFactory: () => ({
                            severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                            actionConfig: {
                                actionButtonType: 'tonal' as const,
                            },
                        }),
                    },
                ],
            });

            const svc = TestBed.inject(TbxMatNotificationService);
            svc.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                action: { label: 'Go' },
            });

            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            expect(data.actionButtonType).toBe('tonal');
        });

        it('should let per-notification actionButtonType override provider', () => {
            TestBed.resetTestingModule();
            afterDismissed$ = new Subject<{ dismissedByAction: boolean }>();
            snackBarSpy.openFromComponent.mockReturnValue({
                afterDismissed: () => afterDismissed$.asObservable(),
                dismiss: vi.fn(),
                dismissWithAction: vi.fn(),
            });

            TestBed.configureTestingModule({
                providers: [
                    TbxMatNotificationService,
                    { provide: MatSnackBar, useValue: snackBarSpy },
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TBX_MAT_NOTIFICATION_PROVIDER_CONFIG,
                        useFactory: () => ({
                            severityIconResolverService: new TbxMatNotificationSeverityFontIconService(),
                            actionConfig: {
                                actionButtonType: 'tonal' as const,
                            },
                        }),
                    },
                ],
            });

            const svc = TestBed.inject(TbxMatNotificationService);
            svc.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                action: { label: 'Go', actionButtonType: 'filled' },
            });

            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            expect(data.actionButtonType).toBe('filled');
        });
    });

    describe('dismissByAction callback', () => {
        it('should call dismissWithAction on the snackbar ref', () => {
            service.show({
                type: TbxMatSeverityLevel.Success,
                message: 'Test',
                action: { label: 'Undo' },
            });

            const mockRef = snackBarSpy.openFromComponent.mock.results[0].value;
            const data = snackBarSpy.openFromComponent.mock.calls[0][1].data;
            data.dismissByAction();

            expect(mockRef.dismissWithAction).toHaveBeenCalled();
        });
    });
});
