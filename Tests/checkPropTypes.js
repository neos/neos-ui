import {t} from 'testcafe';

export default async function () {
    const {error} = await t.getBrowserConsoleMessages();
    if (error) {
        console.log('These console errors were the cause of the failed test:', error);
    }
    await t.expect(error[0]).notOk();
}
