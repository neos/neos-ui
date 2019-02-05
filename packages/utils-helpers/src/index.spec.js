import * as api from './index.js';

test(`should export an object containing the API`, () => {
    expect(typeof api).toBe('object');
});
