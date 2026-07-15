import {APIResponse, TestInfo} from "@playwright/test";

export function loggerFactory(testInfo: TestInfo) {
    return {
        async logResponse(name: string, response: APIResponse) {
            const contentType = response.headers()['Content-Type'] ?? '';
            testInfo.attach(`create-user ${name}`, {
                body: (await response.body()),
                contentType
            });
        }
    }
}
