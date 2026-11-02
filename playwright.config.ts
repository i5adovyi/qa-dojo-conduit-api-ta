import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.TEST_ENV || 'local'}` });

// Relative request URLs must resolve under the API path.
const apiUrl = new URL(
  process.env.CONDUIT_BASE_URL || 'http://localhost:3000/api/'
);
if (
  !['http:', 'https:'].includes(apiUrl.protocol) ||
  apiUrl.username ||
  apiUrl.password ||
  apiUrl.search ||
  apiUrl.hash
) {
  throw new Error(
    'CONDUIT_BASE_URL must be an HTTP(S) API root without credentials, query or fragment.'
  );
}
if (!apiUrl.pathname.endsWith('/')) apiUrl.pathname += '/';

export default defineConfig({
  testDir: './tests/api',
  testMatch: '**/*.spec.ts',
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [{ name: 'Conduit', use: { baseURL: apiUrl.href } }],
});
