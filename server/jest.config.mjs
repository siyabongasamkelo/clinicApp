import { createDefaultEsmPreset } from "ts-jest";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const esmPreset = createDefaultEsmPreset();

export default {
  ...esmPreset, // This "spreads" all the ESM settings into this config
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    // This is the magic fix for the ".js" extension error
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // This tells Jest to use ts-jest for all .ts files
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
