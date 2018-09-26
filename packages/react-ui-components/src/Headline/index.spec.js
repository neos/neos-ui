import Headline from '.';

describe('<Headline/> (entry point)', () => {
    it('should export a Component.', () => {
        expect(typeof Headline).toBe('function');
    });
});
