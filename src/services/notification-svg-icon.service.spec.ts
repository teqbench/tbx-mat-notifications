import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { TbxMatSeverityLevelType } from '@teqbench/tbx-mat-severity-icons';
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
            expect(service.success()).toBe(TbxMatSeverityLevelType.Success);
        });

        it('error() should return the Error enum value', () => {
            expect(service.error()).toBe(TbxMatSeverityLevelType.Error);
        });

        it('warning() should return the Warning enum value', () => {
            expect(service.warning()).toBe(TbxMatSeverityLevelType.Warning);
        });

        it('information() should return the Information enum value', () => {
            expect(service.information()).toBe(TbxMatSeverityLevelType.Information);
        });

        it('help() should return the Help enum value', () => {
            expect(service.help()).toBe(TbxMatSeverityLevelType.Help);
        });
    });

    describe('resolve()', () => {
        it('should resolve all severity levels', () => {
            expect(service.resolve(TbxMatSeverityLevelType.Success)).toBe('success');
            expect(service.resolve(TbxMatSeverityLevelType.Error)).toBe('error');
            expect(service.resolve(TbxMatSeverityLevelType.Warning)).toBe('warning');
            expect(service.resolve(TbxMatSeverityLevelType.Information)).toBe('information');
            expect(service.resolve(TbxMatSeverityLevelType.Help)).toBe('help');
        });

        it('should return undefined for unknown keys', () => {
            expect(service.resolve('unknown')).toBeUndefined();
        });
    });

    describe('register()', () => {
        it('should register all default SVG icons with MatIconRegistry', () => {
            const addSpy = vi.spyOn(MatIconRegistry.prototype, 'addSvgIconLiteral');

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [TbxMatNotificationSvgIconService],
            });

            TestBed.inject(TbxMatNotificationSvgIconService);

            expect(addSpy).toHaveBeenCalledWith('success', expect.anything());
            expect(addSpy).toHaveBeenCalledWith('error', expect.anything());
            expect(addSpy).toHaveBeenCalledWith('warning', expect.anything());
            expect(addSpy).toHaveBeenCalledWith('information', expect.anything());
            expect(addSpy).toHaveBeenCalledWith('help', expect.anything());
            expect(addSpy).toHaveBeenCalledTimes(5);
            addSpy.mockRestore();
        });
    });
});
