import {APIRequestContext, TestInfo} from "@playwright/test";
import {loggerFactory} from "./logger";

export function createUserFactory(request: APIRequestContext, testInfo: TestInfo) {
    const logger = loggerFactory(testInfo);

    return async function createUser(name: string, password: string, roles: string[]): Promise<void> {
        const response = await request.fetch('/test/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {name, password, roles}
        });

        try {
            const json = await response.json();
            if (!('success' in json) || !json.success) {
                throw new Error(`User could not be created. Got [${response.status()}] ${JSON.stringify(json.error)}`);
            }
        } catch (e) {
            logger.logResponse(`error-response create-user ${name} (${response.status()})`, response);
            throw e;
        }
    };
}
