import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { TbxMatSeverityLevel } from '@teqbench/tbx-mat-severity-icons';
import { TbxMatNotificationSeveritySvgIconService } from './notification-severity-svg-icon.service';

describe('TbxMatNotificationSeveritySvgIconService', () => {
    let service: TbxMatNotificationSeveritySvgIconService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TbxMatNotificationSeveritySvgIconService],
        });

        service = TestBed.inject(TbxMatNotificationSeveritySvgIconService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('severity methods', () => {
        it('success() should return the Success enum value', () => {
            expect(service.success()).toBe(TbxMatSeverityLevel.Success);
        });

        it('error() should return the Error enum value', () => {
            expect(service.error()).toBe(TbxMatSeverityLevel.Error);
        });

        it('warning() should return the Warning enum value', () => {
            expect(service.warning()).toBe(TbxMatSeverityLevel.Warning);
        });

        it('information() should return the Information enum value', () => {
            expect(service.information()).toBe(TbxMatSeverityLevel.Information);
        });

        it('help() should return the Help enum value', () => {
            expect(service.help()).toBe(TbxMatSeverityLevel.Help);
        });
    });

    describe('resolve()', () => {
        it('should resolve all severity levels', () => {
            expect(service.resolve(TbxMatSeverityLevel.Success)).toBe('success');
            expect(service.resolve(TbxMatSeverityLevel.Error)).toBe('error');
            expect(service.resolve(TbxMatSeverityLevel.Warning)).toBe('warning');
            expect(service.resolve(TbxMatSeverityLevel.Information)).toBe('information');
            expect(service.resolve(TbxMatSeverityLevel.Help)).toBe('help');
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
                providers: [TbxMatNotificationSeveritySvgIconService],
            });

            TestBed.inject(TbxMatNotificationSeveritySvgIconService);

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
