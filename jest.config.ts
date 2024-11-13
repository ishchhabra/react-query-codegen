import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // Optional but recommended for TypeScript projects
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Optional: Coverage settings
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
  ],
};

export default config;
