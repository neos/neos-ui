import {APIRequestContext, TestInfo} from "@playwright/test";
import {loggerFactory} from "./logger";

export function removeAllUsersFactory(request: APIRequestContext, testInfo: TestInfo) {
    const logger = loggerFactory(testInfo);

    return async function removeAllUsers(prefix: string): Promise<void> {
        const response = await request.fetch('/test/remove-all-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {prefix}
        });

        try {
            const json = await response.json();
            if (!('success' in json) || !json.success) {
                throw new Error(`User could not be removed. Got status ${response.status()} ${JSON.stringify(json.error)}`);
            }
        } catch (e) {
            logger.logResponse(`error-response remove-all-users ${prefix} (${response.status()})`, response);
            throw e;
        }
    }
}
