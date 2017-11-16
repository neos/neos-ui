import Headline from './index.js';

describe('<Headline/> (entry point)', () => {
    it('should export a Component.', () => {
        expect(typeof Headline).toBe('function');
    });
});
