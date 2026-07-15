# E2E Tests

End-to-end tests for `neos/neos-ui`, using [Playwright](https://playwright.dev) with
[playwright-bdd](https://vitalets.github.io/playwright-bdd/) for Gherkin scenarios. Tests run against a Dockerised
Neos instance (the *system under test*, SUT) — no local Neos installation needed.

## Prerequisites

- Docker
- Node.js ≥ 24 (or [nvm](https://github.com/nvm-sh/nvm) — `make setup` uses it if present)
- make

## Setup

```bash
cd Tests/E2E
make setup
```

Builds the SUT image, installs npm dependencies and Playwright browsers, and generates the test files from the
feature files.

## Running tests

> Cheat: Just run `make sut-down && make setup && make test`

```bash
make test            # run all tests; auto-starts and tears down the SUT
make start-sut       # start the SUT in the background
make test-ui         # interactive Playwright UI
```

The first SUT boot takes a few minutes (composer install, migrations, content import). Subsequent runs reuse the
cached image and named volume for composer cache.

Pass Playwright flags through `npm run test`: `npm run test -- --grep "Login"`,
`npm run test -- --project=chromium`.

## Container management

```bash
make log-sut         # stream SUT logs
make enter-sut       # bash shell inside the SUT
make sut-down        # stop containers and delete volumes
```

## Directory layout

```
Tests/E2E/
├── features/                # Gherkin .feature files
├── steps/                   # step definitions (.steps.ts) + hooks.ts
├── helpers/
│   ├── pages/               # page objects (NeosInspector, NeosTree, …)
│   ├── content-iframe.ts    # iframe + inline-editor helpers
│   └── system.ts            # Flow CLI wrappers (createUser, logout, …)
├── system_under_test/       # Dockerfile, compose, Neos config overrides
├── playwright.config.ts
└── Makefile
```

## Writing tests

Tests have two parts: a **feature file** (what to test) and a **steps file** (how). Steps defined anywhere under
`steps/` are visible to all features.

### 1. Feature

```gherkin
# features/my-feature.feature
Feature: My feature

  Background:
    Given A user with username "admin", password "password" and role "Neos.Neos:Administrator" exists
    And I log in with username "admin" and password "password"

  Scenario: Admin does the thing
    When I do the thing
    Then I should see the result
```

### 2. Steps

Reuse existing steps where possible. New steps go in a `*.steps.ts` file:

```typescript
import {expect} from "@playwright/test";
import {createBdd} from "playwright-bdd";
import {NeosInspector} from "../helpers/pages";

const {When, Then} = createBdd();

When("I do the thing", async ({page}) => {
    const inspector = new NeosInspector(page);
    await inspector.applyButton().click();
});
```

### 3. Page objects

Locator-only classes live in `helpers/pages/` (one file per area: inspector, tree, dialogs, toolbar, …). Add new
locators to the matching class, or create a new class for a new region. Tests must drive the UI through the DOM —
do not depend on the Redux store.

### 4. Flow CLI

`helpers/system.ts` runs Flow commands inside the SUT container (`createUser`, `removeAllUsers`, `logout`). Add
more wrappers there following the same `docker exec` pattern.

### 5. Cleanup

`steps/hooks.ts` runs `AfterScenario`: logs out and removes all users so each scenario starts clean. Add cleanup
for any other persistent state you create.

### 6. Regenerate BDD files

After editing feature files: `make generate-bdd-files`. Done automatically by `make setup` and `make test`.

## IDE setup

**VSCode** — install `CucumberOpen.cucumber-official` and add to settings for step definition recognition:
```json
{"cucumber.glue": ["steps/**/*.steps.ts"]}
```

**JetBrains** — install the "Gherkin" and "Cucumber.js" plugins; recommended: mark `.features-gen/` as Excluded.

## FLOW_CONTEXT

Tests run with `FLOW_CONTEXT=Production/E2E-SUT`, loading
`system_under_test/sut_file_system_overrides/app/Configuration/Production/E2E-SUT/`. To test variant
configurations, add a sub-context (e.g. `Production/E2E-SUT/my-variant/`) and a matching npm script.
