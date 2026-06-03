module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/services"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true
};
