module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.tsx?$': [
          'ts-jest', 
          {
            tsconfig: 'tsconfig.json',
          }
        ],
      },
    testMatch: ['**/tests/**/*.test.ts', '**/*.test.ts', '**/tests/**/*.test.js', '**/*.test.js'],
};