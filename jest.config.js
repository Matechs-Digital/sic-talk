module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './',
    verbose: true,
    clearMocks: true,
    collectCoverage: false,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.ts"
    ],
    testRegex: 'test'
};