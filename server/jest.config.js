export default {
  transform: {},
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true, //will get coverage
  coverageDirectory: "coverage", //will output coverage files
  collectCoverageFrom: ["src/**/*.js", "!src/**/index.js", "!src/**/*.validator.js"], // WUll collect data from this for coverage
};
