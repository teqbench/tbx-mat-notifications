import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    plugins: [angular({ jit: true, tsconfig: 'tsconfig.spec.json' })],
    resolve: {
        // When using npm link, symlinked packages resolve @angular/* from their
        // own node_modules instead of the host's. This causes duplicate Angular
        // instances and breaks DI (inject() context errors). Deduplication forces
        // a single instance across the dependency graph. Safe to leave in place —
        // has no effect when packages are installed from the registry.
        dedupe: ['@angular/core', '@angular/material', '@angular/platform-browser'],
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        passWithNoTests: false,
        coverage: {
            exclude: [
                // Interfaces — no runtime code
                'src/models/notification-config.model.ts',
                'src/models/notification-data.model.ts',
                // Type aliases — no runtime code
                'src/types/notification-config-args.type.ts',
                // Constants — no testable logic
                'src/constants/notification.constants.ts',
                // Tokens (InjectionToken declarations — no testable logic)
                'src/tokens/notification-provider-config.token.ts',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                statements: 80,
                branches: 75,
                perFile: true,
            },
        },
    },
});
