import getVersion from './getVersion';
import fs from 'fs';

test(`should return the correct version, if this test fails try running ./Build/createVersionFile.sh`, () => {
    const actual = getVersion();

    const expectedVersion = JSON.parse(fs.readFileSync('./package.json').toString()).version;
    const expected = `v${expectedVersion}`;

    expect(actual).toBe(expected);
});
