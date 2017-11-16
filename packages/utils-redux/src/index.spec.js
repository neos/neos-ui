import * as api from './index.js';

test(`should export the handleActions function`, () => {
    expect(typeof api.handleActions).toBe('function');
});
