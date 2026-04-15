import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './src',
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    collectCoverageFrom: [
        'modules/**/*.ts',         // only business modules
        '!modules/**/*.types.ts',  // exclude type files
        '!modules/**/*.routes.ts', // exclude routes (they are just registrations)
        'middleware/**/*.ts',
    ],
    coverageReporters: ['text', 'lcov', 'html'],
};

export default config;