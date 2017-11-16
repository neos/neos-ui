import * as API from './index.js';

describe('API entry point', () => {
    it('should export an object of components.', () => {
        expect(typeof API).toBe('object');
    });
});
