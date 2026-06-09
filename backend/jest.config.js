module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/config/**", "!src/server.js"],
  coverageReporters: ["text", "lcov"],
};
