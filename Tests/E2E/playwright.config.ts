import {defineConfig, devices} from "@playwright/test";
import {defineBddConfig} from "playwright-bdd";

const testDir = defineBddConfig({
    features: "features/**/*.feature",
    steps: "steps/**/*.ts",
});

export default defineConfig({
    testDir,
    fullyParallel: false,
    // workers: 1 is required: the SUT uses a single MariaDB instance and scenarios mutate global state
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    timeout: 60_000,
    expect: {
        timeout: 30_000
    },
    forbidOnly: Boolean(process.env.CI),
    reporter: process.env.CI
        ? [['html', {open: 'never'}], ['json', {outputFile: 'playwright-report/results.json'}]]
        : [['html', {open: 'on-failure'}], ['list']],
    use: {
        baseURL: "http://localhost:8081",
        actionTimeout: 10_000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry'
    },
    webServer: {
        command: `echo "Neos not running please start via 'make start-sut'"; exit 1;`,
        url: "http://localhost:8081/",
        reuseExistingServer: true,
        timeout: 600_000,
        stdout: "pipe",
        stderr: "pipe",
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome'], viewport: {width: 1280, height: 800}}
        },
        {
            name: 'firefox',
            use: {...devices['Desktop Firefox'], viewport: {width: 1280, height: 800}}
        },
        {
            name: 'webkit',
            use: {...devices['Desktop Safari'], viewport: {width: 1280, height: 800}}
        }
    ],
});
