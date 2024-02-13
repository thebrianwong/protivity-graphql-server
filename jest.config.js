/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  modulePaths: ["node_modules", "<rootDir>/src"],
  extensionsToTreatAsEsm: [".ts"],
  transform_regex: {
    "ts-jest": {
      //... // your other configurations here
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
