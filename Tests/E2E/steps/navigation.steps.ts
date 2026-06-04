import {expect} from "@playwright/test";
import {createBdd} from "playwright-bdd";
import {NeosTree} from "../helpers/pages";

const {When} = createBdd();

When("I navigate to the {string} page", async ({page}, pageTitle: string) => {
    const tree = new NeosTree(page);
    await tree.nodeLabel(pageTitle).click();

    // Wait for the focused tree node to reflect the navigation. Using DOM observation
    // (no Redux store access): when a tree node becomes the current document, its
    // ancestor button gets a class containing "isFocused" applied by the tree.
    await expect(
        page.locator('[role="treeitem"] [role="button"][class*="isFocused"]')
            .filter({hasText: pageTitle}),
    ).toBeVisible();
});

When("I reload the page", async ({page}) => {
    await page.reload();
});

When("I press the hotkey {string}", async ({page}, keys: string) => {
    for (const key of keys.split(" ")) {
        await page.keyboard.press(key);
    }
});
