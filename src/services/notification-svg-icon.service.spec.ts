import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { TbxSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatNotificationSvgIconService } from './notification-svg-icon.service';

describe('TbxMatNotificationSvgIconService', () => {
    let service: TbxMatNotificationSvgIconService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TbxMatNotificationSvgIconService],
        });

        service = TestBed.inject(TbxMatNotificationSvgIconService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('severity methods', () => {
        it('success() should return the Success enum value', () => {
            expect(service.success()).toBe(TbxSeverityLevelType.Success);
        });

        it('error() should return the Error enum value', () => {
            expect(service.error()).toBe(TbxSeverityLevelType.Error);
        });

        it('warning() should return the Warning enum value', () => {
            expect(service.warning()).toBe(TbxSeverityLevelType.Warning);
        });

        it('information() should return the Information enum value', () => {
            expect(service.information()).toBe(TbxSeverityLevelType.Information);
        });

        it('help() should return the Help enum value', () => {
            expect(service.help()).toBe(TbxSeverityLevelType.Help);
        });
    });

    describe('resolve()', () => {
        it('should resolve all severity levels', () => {
            expect(service.resolve(TbxSeverityLevelType.Success)).toBe('success');
            expect(service.resolve(TbxSeverityLevelType.Error)).toBe('error');
            expect(service.resolve(TbxSeverityLevelType.Warning)).toBe('warning');
            expect(service.resolve(TbxSeverityLevelType.Information)).toBe('information');
            expect(service.resolve(TbxSeverityLevelType.Help)).toBe('help');
        });

        it('should return undefined for unknown keys', () => {
            expect(service.resolve('unknown')).toBeUndefined();
        });
    });

    describe('register()', () => {
        it('should register SVG markup with MatIconRegistry', () => {
            const addSpy = vi.spyOn(MatIconRegistry.prototype, 'addSvgIconLiteral');

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [TbxMatNotificationSvgIconService],
            });

            // Subclass that registers SVGs
            class TestSvgService extends TbxMatNotificationSvgIconService {
                constructor() {
                    super();
                    this.register(TbxSeverityLevelType.Success, '<svg>check</svg>');
                }
            }

            TestBed.configureTestingModule({
                providers: [TestSvgService],
            });

            TestBed.inject(TestSvgService);

            expect(addSpy).toHaveBeenCalledWith('success', expect.anything());
            addSpy.mockRestore();
        });
    });
});
