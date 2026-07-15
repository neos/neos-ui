import type {Page} from "@playwright/test";

export async function logout(page: Page) {
    await page.context().request.post("/neos/logout");
}
