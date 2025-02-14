/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  collectCoverageFrom: ['src/index.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
}
