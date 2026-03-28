import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
} from '@teqbench/tbx-mat-icons';
import { TbxMatNotificationIconService } from './notification-icon.service';

describe('TbxMatNotificationIconService', () => {
    describe('with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token', () => {
        let service: TbxMatNotificationIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TbxMatNotificationIconService,
                        useFactory: () => new TbxMatNotificationIconService(),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationIconService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should use the token font set', () => {
            expect(service.fontSet).toBe('material-symbols-rounded');
        });

        describe('severity ligatures', () => {
            it('success() should return "check_circle"', () => {
                expect(service.success()).toBe('check_circle');
            });

            it('error() should return "error"', () => {
                expect(service.error()).toBe('error');
            });

            it('warning() should return "warning_amber"', () => {
                expect(service.warning()).toBe('warning_amber');
            });

            it('information() should return "info"', () => {
                expect(service.information()).toBe('info');
            });

            it('help() should return "help"', () => {
                expect(service.help()).toBe('help');
            });
        });

        describe('resolve()', () => {
            it('should resolve success level', () => {
                expect(service.resolve('success')).toBe('check_circle');
            });

            it('should resolve error level', () => {
                expect(service.resolve('error')).toBe('error');
            });

            it('should resolve warning level', () => {
                expect(service.resolve('warning')).toBe('warning_amber');
            });

            it('should resolve information level', () => {
                expect(service.resolve('information')).toBe('info');
            });

            it('should resolve help level', () => {
                expect(service.resolve('help')).toBe('help');
            });
        });
    });

    describe('with explicit fontSet via useFactory', () => {
        let service: TbxMatNotificationIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TbxMatNotificationIconService,
                        useFactory: () =>
                            new TbxMatNotificationIconService('material-symbols-outlined'),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationIconService);
        });

        it('should use the explicitly provided font set', () => {
            expect(service.fontSet).toBe('material-symbols-outlined');
        });
    });

    describe('with both explicit fontSet and token', () => {
        let service: TbxMatNotificationIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TbxMatNotificationIconService,
                        useFactory: () =>
                            new TbxMatNotificationIconService('material-symbols-sharp'),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationIconService);
        });

        it('should prefer the explicit fontSet over the token', () => {
            expect(service.fontSet).toBe('material-symbols-sharp');
        });
    });

    describe('without fontSet or token', () => {
        it('should throw when neither fontSet nor token is provided', () => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TbxMatNotificationIconService,
                        useFactory: () => new TbxMatNotificationIconService(),
                    },
                ],
            });

            expect(() => TestBed.inject(TbxMatNotificationIconService)).toThrow(
                /TBX_MAT_FONT_ICON_DEFAULT_FONT_SET/
            );
        });
    });
});
