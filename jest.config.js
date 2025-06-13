module.exports = {
  projects: [
    {
      displayName: 'admin',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/admin/**/*.test.{js,jsx}'],
      setupFilesAfterEnv: ['<rootDir>/admin/src/tests/setup.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/admin/src/tests/__mocks__/styleMock.js',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/admin/src/tests/__mocks__/fileMock.js',
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(@strapi|@faker-js)/)',
      ],
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/server/tests/setup.js'],
    },
  ],
  collectCoverageFrom: [
    'admin/src/**/*.{js,jsx}',
    'server/src/**/*.js',
    '!**/*.test.{js,jsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};