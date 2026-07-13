import {expect} from "@playwright/test";
import {createBdd} from "playwright-bdd";
import {NeosContentPage, NeosLoginPage} from "../helpers/pages";
import {createUser} from "../helpers/test-api";
import {logout} from "../helpers/system";

const {Given, When, Then} = createBdd();

// ── Background / Given ────────────────────────────────────────────────────────

Given(
    "A user with username {string}, password {string} and role {string} exists",
    async ({}, username: string, password: string, role: string) => {
        await createUser(username, password, [role]);
    },
);

// ── When ──────────────────────────────────────────────────────────────────────

When("I log in with username {string} and password {string}", async ({page}, username: string, password: string) => {
    const loginPage = new NeosLoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
    await page.waitForLoadState("networkidle");
});

When("I log out", async ({page}) => {
    await logout(page);
});

// ── Then ──────────────────────────────────────────────────────────────────────

Then("I should see the Neos content page", async ({page}) => {
    const neosContentPage = new NeosContentPage(page);
    await expect(page).toHaveURL(neosContentPage.URL_REGEX);
});

Then("I cannot access the Neos content page", async ({page}) => {
    const neosContentPage = new NeosContentPage(page);
    await neosContentPage.goto();

    // expecting to be redirected (e.g. to /neos/login)
    await expect(page).not.toHaveURL(neosContentPage.URL_REGEX);
});
