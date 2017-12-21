import getVersion from './getVersion';
import fs from 'fs';

test(`should return the correct version`, () => {
    const actual = getVersion();
    const current = `v${JSON.parse(fs.readFileSync('./package.json').toString()).version}`;
    console.error(current);
    expect(actual).toBe(current);
});
