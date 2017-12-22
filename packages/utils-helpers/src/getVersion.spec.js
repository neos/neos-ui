import getVersion from './getVersion';
import fs from 'fs';

test(`should return the correct version, if this test fails try running ./Build/fillVersion.sh`, () => {
    const actual = getVersion();

    const expectedVersion = JSON.parse(fs.readFileSync('./package.json').toString()).version;
    const expectedCommitHash = require('child_process')
        .execSync('git rev-parse HEAD')
        .toString().trim();
    const expected = `v${expectedVersion} ${expectedCommitHash}`;

    expect(actual).toBe(expected);
});
