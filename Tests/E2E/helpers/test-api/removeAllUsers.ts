import {APIRequestContext} from "@playwright/test";

export async function removeAllUsers(request: APIRequestContext, prefix: string): Promise<void> {
    const response = await request.fetch('/test/remove-all-users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {prefix}
    });
    const json = await response.json();
    if (!('success' in json) || !json.success) {
        throw new Error(`User could not be removed. Got status ${response.status()}`);
    }
}
