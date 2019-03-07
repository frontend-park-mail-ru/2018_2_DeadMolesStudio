module.exports = {
    roots: [
        '<rootDir>/public',
    ],
    testRegex: 'test.ts',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    collectCoverageFrom: [
        'public/**/*.ts',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
};
