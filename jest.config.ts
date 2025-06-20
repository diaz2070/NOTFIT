import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/db/**', // Exclude database files since they are not part of the app logic
    '!src/components/ui/**', // Exclude UI components since they are shadcn components
    '!src/lib/**', // Exclude library files since its shadcn components
    '!src/app/layout.tsx', // Exclude layout files
    '!src/auth/**', // Exclude auth files since they are supabase specific
    '!**/node_modules/**',
  ],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // If you use path aliases like @/components
  },
};

export default createJestConfig(config);
