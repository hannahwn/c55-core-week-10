import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Global test timeout (30 seconds for API calls)
    testTimeout: 30000,

    // Run tests sequentially to avoid conflicts with the API server
    sequence: {
      concurrent: false,
    },

    // Display options
    reporters: ['verbose'],

    // Include test files
    include: ['task-1/tests/**/*.test.js', 'task-2/post-cli/tests/**/*.test.js'],

    // Global setup - you can add setup/teardown hooks here if needed
    globals: true,
  },
});
