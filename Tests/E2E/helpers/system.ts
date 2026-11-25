import type {Page} from "@playwright/test";

export async function logout(page: Page) {
    await page.context().request.post("/neos/logout");
}

export async function executeGenericCommand(command: string, payload: Record<string, string> = {}) {
    const baseUrl = process.env.NEOS_BASE_URL ?? "http://localhost:8081";
    const response = await fetch(`${baseUrl}/neos/generic-command?commandClassName=${command}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({arguments: payload}),
    });

    if (!response.ok) {
        throw new Error(
            `executeGenericCommand failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}