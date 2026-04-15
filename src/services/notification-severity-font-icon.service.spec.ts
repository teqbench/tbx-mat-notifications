import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED } from '@teqbench/tbx-mat-icons';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-theme';
import { TbxMatNotificationSeverityFontIconService } from './notification-severity-font-icon.service';

describe('TbxMatNotificationSeverityFontIconService', () => {
    describe('with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token', () => {
        let service: TbxMatNotificationSeverityFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TbxMatNotificationSeverityFontIconService,
                        useFactory: () => new TbxMatNotificationSeverityFontIconService(),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationSeverityFontIconService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should use the token fontSet', () => {
            expect(service.fontSet).toBe('material-symbols-rounded');
        });

        describe('severity methods', () => {
            it('default() should return "info"', () => {
                expect(service.default()).toBe('info');
            });

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
            it('should resolve all severity levels', () => {
                expect(service.resolve(TbxMatSeverityLevel.Default)).toBe('info');
                expect(service.resolve(TbxMatSeverityLevel.Success)).toBe('check_circle');
                expect(service.resolve(TbxMatSeverityLevel.Error)).toBe('error');
                expect(service.resolve(TbxMatSeverityLevel.Warning)).toBe('warning_amber');
                expect(service.resolve(TbxMatSeverityLevel.Information)).toBe('info');
                expect(service.resolve(TbxMatSeverityLevel.Help)).toBe('help');
            });

            it('should return undefined for unknown keys', () => {
                expect(service.resolve('unknown')).toBeUndefined();
            });
        });
    });

    describe('with explicit fontSet via constructor', () => {
        let service: TbxMatNotificationSeverityFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TbxMatNotificationSeverityFontIconService,
                        useFactory: () => new TbxMatNotificationSeverityFontIconService('material-symbols-outlined'),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationSeverityFontIconService);
        });

        it('should use the explicitly provided fontSet', () => {
            expect(service.fontSet).toBe('material-symbols-outlined');
        });
    });
});
