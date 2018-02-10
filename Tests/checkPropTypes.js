import { t } from 'testcafe';

export default async function () {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect(error[0]).notOk();
}