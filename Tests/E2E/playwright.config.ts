import {defineConfig, devices} from "@playwright/test";
import {defineBddConfig} from "playwright-bdd";

const testDir = defineBddConfig({
    features: "features/**/*.feature",
    steps: "steps/**/*.ts",
});

const sharedBrowserConfiguration = {
    viewport: {
        width: 1280,
        height: 800
    },
    // FIXME, disable animations for popups so there is no flickering when viewing the screenshot-video in interactive mode
    // contextOptions: {
    //     reducedMotion: 'reduce',
    // }
} as const;


export default defineConfig({
    testDir,
    fullyParallel: false,
    workers: process.env.CI ? 1 : '50%',
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
        baseURL: "http://onedimension.localhost:8081",
        actionTimeout: 10_000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry'
    },
    webServer: {
        command: `echo "Neos not running please start via 'make start-sut'"; exit 1;`,
        url: "http://onedimension.localhost:8081/neos",
        reuseExistingServer: true,
        timeout: 600_000,
        stdout: "pipe",
        stderr: "pipe",
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome'], ...sharedBrowserConfiguration}
        },
        {
            name: 'firefox',
            use: {...devices['Desktop Firefox'], ...sharedBrowserConfiguration}
        },
        {
            name: 'webkit',
            use: {...devices['Desktop Safari'], ...sharedBrowserConfiguration}
        }
    ],
});
