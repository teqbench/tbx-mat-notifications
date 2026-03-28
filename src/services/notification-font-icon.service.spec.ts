import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
    TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
    TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
} from '@teqbench/tbx-mat-icons';
import { TbxSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatNotificationFontIconService } from './notification-font-icon.service';

describe('TbxMatNotificationFontIconService', () => {
    describe('with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token', () => {
        let service: TbxMatNotificationFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TbxMatNotificationFontIconService,
                        useFactory: () => new TbxMatNotificationFontIconService(),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationFontIconService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should use the token fontSet', () => {
            expect(service.fontSet).toBe('material-symbols-rounded');
        });

        describe('severity methods', () => {
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
                expect(service.resolve(TbxSeverityLevelType.Success)).toBe('check_circle');
                expect(service.resolve(TbxSeverityLevelType.Error)).toBe('error');
                expect(service.resolve(TbxSeverityLevelType.Warning)).toBe('warning_amber');
                expect(service.resolve(TbxSeverityLevelType.Information)).toBe('info');
                expect(service.resolve(TbxSeverityLevelType.Help)).toBe('help');
            });

            it('should return undefined for unknown keys', () => {
                expect(service.resolve('unknown')).toBeUndefined();
            });
        });
    });

    describe('with explicit fontSet via useFactory', () => {
        let service: TbxMatNotificationFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TbxMatNotificationFontIconService,
                        useFactory: () =>
                            new TbxMatNotificationFontIconService('material-symbols-outlined'),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationFontIconService);
        });

        it('should use the explicitly provided fontSet', () => {
            expect(service.fontSet).toBe('material-symbols-outlined');
        });
    });
});
