import {expect} from "@playwright/test";
import {createBdd} from "playwright-bdd";

const {Then} = createBdd();

Then("the test plugin manifest should have been invoked {int} time(s)", async ({page}, expected: number) => {
    const value = await page.evaluate(() => window.neosUiTestPlugin.manifestInvocations);
    expect(value).toBe(expected);
});

Then("the test plugin global registry access should report {string}", async ({page}, expected: string) => {
    const value = await page.evaluate(() => window.neosUiTestPlugin.globalGlobalRegistryAccess);
    expect(value).toBe(expected);
});

Then("the test plugin legacy global registry access should report {string}", async ({page}, expected: string) => {
    const value = await page.evaluate(() => window.neosUiTestPlugin.legacyGlobalRegistryAccess);
    expect(value).toBe(expected);
});

Then("the test plugin's own registry should yield {string}", async ({page}, expected: string) => {
    const value = await page.evaluate(() => window.neosUiTestPlugin.getPluginRegistryValue());
    expect(value).toBe(expected);
});

Then("the test plugin's own legacy registry should yield {string}", async ({page}, expected: string) => {
    const value = await page.evaluate(() => window.neosUiTestPlugin.getPluginLegacyRegistryValue());
    expect(value).toBe(expected);
});

Then("the test plugin configuration access should report {string}", async ({page}, expected: string) => {
    const value = await page.evaluate(() => window.neosUiTestPlugin.globalConfigurationAccess);
    expect(value).toBe(expected);
});

Then("the test plugin legacy configuration access should report {string}", async ({page}, expected: string) => {
    const value = await page.evaluate(() => window.neosUiTestPlugin.legacyConfigurationAccess);
    expect(value).toBe(expected);
});

Then("the test plugin frontend configuration {string} should expose {string}", async ({page}, key: string, expected: string) => {
    const value = await page.evaluate(
        (k: string) => window.neosUiTestPlugin.globalFrontendConfigurationAccess?.[k],
        key,
    );
    expect(value).toBe(expected);
});

Then("the test plugin legacy frontend configuration {string} should expose {string}", async ({page}, key: string, expected: string) => {
    const value = await page.evaluate(
        (k: string) => window.neosUiTestPlugin.legacyFrontendConfigurationAccess[k],
        key,
    );
    expect(value).toBe(expected);
});
