import Button from './index.js';

describe('<Button/> (entry point)', () => {
    it('should export a Component.', () => {
        expect(typeof Button).toBe('function');
    });
});
