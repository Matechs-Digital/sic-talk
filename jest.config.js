module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './',
    verbose: true,
    clearMocks: true,
    collectCoverage: false,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/(1|2)*.ts"
    ],
    testRegex: 'test'
};