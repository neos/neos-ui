import SideBar from './index.js';

describe('<SideBar/> (entry point)', () => {
    it('should export a Component.', () => {
        expect(typeof SideBar).toBe('function');
    });
});
