import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TBX_MAT_FONT_ICON_DEFAULT_FONT_SET, TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED, TbxMatIconType } from '@teqbench/tbx-mat-icons';
import { TbxMatNotificationCloseFontIconService } from './notification-close-font-icon.service';

describe('TbxMatNotificationCloseFontIconService', () => {
    describe('with TBX_MAT_FONT_ICON_DEFAULT_FONT_SET token', () => {
        let service: TbxMatNotificationCloseFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TBX_MAT_FONT_ICON_DEFAULT_FONT_SET,
                        useValue: TBX_MAT_ICON_FONT_SET_MATERIAL_SYMBOLS_ROUNDED,
                    },
                    {
                        provide: TbxMatNotificationCloseFontIconService,
                        useFactory: () => new TbxMatNotificationCloseFontIconService(),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationCloseFontIconService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should use the token fontSet', () => {
            expect(service.fontSet).toBe('material-symbols-rounded');
        });

        it('should have Font icon type', () => {
            expect(service.iconType).toBe(TbxMatIconType.Font);
        });

        describe('resolve()', () => {
            it('should resolve "close" to "close" ligature', () => {
                expect(service.resolve('close')).toBe('close');
            });

            it('should return undefined for unknown keys', () => {
                expect(service.resolve('unknown')).toBeUndefined();
            });
        });
    });

    describe('with explicit fontSet via constructor', () => {
        let service: TbxMatNotificationCloseFontIconService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: TbxMatNotificationCloseFontIconService,
                        useFactory: () => new TbxMatNotificationCloseFontIconService('material-symbols-outlined'),
                    },
                ],
            });

            service = TestBed.inject(TbxMatNotificationCloseFontIconService);
        });

        it('should use the explicitly provided fontSet', () => {
            expect(service.fontSet).toBe('material-symbols-outlined');
        });
    });
});
