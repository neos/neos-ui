import {APIRequestContext} from "@playwright/test";

export async function createUser(request: APIRequestContext, name: string, password: string, roles: string[]): Promise<void> {
    const response = await request.fetch('/test/create-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {name, password, roles}
    });
    const json = await response.json();
    if (!('success' in json) || !json.success) {
        throw new Error(`Use could not be created. Got status ${response.status()}`);
    }
}
