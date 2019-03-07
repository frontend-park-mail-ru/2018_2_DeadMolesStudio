module.exports = {
    roots: [
        '<rootDir>/public',
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: 'test.ts',
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
    collectCoverageFrom: [
        'public/**/*.ts',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
};
