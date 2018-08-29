import identifiers from './identifiers';

describe('Theme identifiers', () => {
    it('should export an object of strings.', () => {
        expect(typeof identifiers).toBe('object');
    });
});
