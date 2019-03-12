import * as API from '.';

describe('API entry point', () => {
    it('should export an object of components.', () => {
        expect(typeof API).toBe('object');
    });
});
