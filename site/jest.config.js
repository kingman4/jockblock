export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/vendor/**'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  transform: {}
};
