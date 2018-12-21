import * as api from './index';

test(`should export the handleActions function`, () => {
    expect(typeof api.handleActions).toBe('function');
});
