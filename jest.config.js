const commonSettings = {
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '^@apps/(.*)$': '<rootDir>/apps/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@infra/(.*)$': '<rootDir>/infra/$1',
    '^@domain/(.*)$': '<rootDir>/domain/$1',
  },
  testEnvironment: 'node',
};

module.exports = {
  verbose: true,
  projects: [
    {
      displayName: 'api:e2e',
      testMatch: ['<rootDir>/apps/api/test/e2e/**/*spec.ts'],
      preset: 'ts-jest',
      ...commonSettings,
    },
    {
      displayName: 'api:integration',
      testMatch: ['<rootDir>/apps/api/test/integration/**/*spec.ts'],
      preset: 'ts-jest',
      ...commonSettings,
    },
    // Add more projects here if needed
  ],
  testRegex: '.*\\.spec\\.ts$',
  rootDir: '.',
  globalSetup: '<rootDir>/test/global-setup.ts',
  globalTeardown: '<rootDir>/test/global-teardown.ts',
  roots: ['<rootDir>/apps/'],
  collectCoverageFrom: ['<rootDir>/apps/**/src/app/**/*/spec.(t|j)s'],
  ...commonSettings,
};
