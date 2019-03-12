import * as api from './index';

test(`should export an object containing the API`, () => {
    expect(typeof api).toBe('object');
});
