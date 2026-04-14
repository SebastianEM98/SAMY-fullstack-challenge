import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './src',
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleNameMapper: {
        '^../../generated/prisma/client$': '<rootDir>/__mocks__/prisma.ts',
    },
    clearMocks: true,
};

export default config;