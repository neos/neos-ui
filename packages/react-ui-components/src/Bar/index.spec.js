import Bar from '.';

describe('<Bar/> (entry point)', () => {
    it('should export a Component.', () => {
        expect(typeof Bar).toBe('function');
    });
});
