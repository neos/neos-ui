import type {Page} from "@playwright/test";
import {createUniqueUserName} from "../user";

export class NeosLoginPage {
    constructor(private readonly page: Page) {
    }

    async goto() {
        await this.page.goto("/neos/login");
    }

    async login(username: string, password: string) {
        await this.page.locator('input[type="text"]').fill(createUniqueUserName(username));
        await this.page.locator('input[type="password"]').fill(password);
        await this.page.locator(".neos-login-btn:not(.neos-disabled):not(.neos-hidden)").click();
    }
}
