import identifiers from './identifiers.js';

describe('Theme identifiers', () => {
    it('should export an object of strings.', () => {
        expect(typeof identifiers).toBe('object');
    });
});
