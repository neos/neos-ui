import Bar from './index.js';

describe('<Bar/> (entry point)', () => {
    it('should export a Component.', () => {
        expect(typeof Bar).toBe('function');
    });
});
