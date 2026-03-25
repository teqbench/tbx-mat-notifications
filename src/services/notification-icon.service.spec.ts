import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NotificationIconService } from './notification-icon.service';

describe('NotificationIconService', () => {
    let service: NotificationIconService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NotificationIconService],
        });

        service = TestBed.inject(NotificationIconService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should use material-symbols-rounded font set', () => {
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
