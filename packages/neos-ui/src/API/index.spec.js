import api, {createPlugin, define} from './index.js';

describe('"api.factory"', () => {
    describe('"createPlugin" utility', () => {
        it('should expose a method to create plugins which will add the given identifier to the constructor.', () => {
            const plugin = createPlugin('myName', () => null);

            expect(plugin.identifier).to.equal('myName');
        });
    });

    describe('"define" utility', () => {
        it('should return a curry function which defines the given identifier/value in the given target object.', () => {
            const target = {};
            const targetDefine = define(target);

            expect(targetDefine).to.be.an('function');

            targetDefine('myName', 'value');

            expect(target.myName).to.exist; // eslint-disable-line
        });

        it('should throw an error if the given identifier was already registered in the parent.', () => {
            const target = {};
            const targetDefine = define(target);
            const fn = () => targetDefine('myName', 'value');

            targetDefine('myName', 'value');

            expect(fn).to.throw();
        });
    });

    it('should throw an error if no csrfToken was passed.', () => {
        const fn = () => api({});

        expect(fn).to.throw();
    });

    it('should place itself inside the specified parent object with the specified alias.', () => {
        const win = {};

        api(win, 'csrfToken', 'test');

        expect(win.test).to.exist; // eslint-disable-line
    });

    it('should throw an error if a value already exists under the given alias in parent.', () => {
        const win = {};
        const fn = () => api(win, 'csrfToken');

        api(win, 'csrfToken');

        expect(fn).to.throw();
    });

    it('should have a fallback alias "neos" if none was specified.', () => {
        const win = {};

        api(win, 'csrfToken');

        expect(win.neos).to.exist; // eslint-disable-line
    });

    it('should not be writable.', () => {
        const win = {};
        const fn = () => {
            win.neos = 'test';
        };

        api(win, 'csrfToken');

        const oldApi = win.neos;

        expect(fn).to.throw();
        expect(win.neos).to.equal(oldApi);
    });

    it('should expose the use method by default.', () => {
        const win = {};

        api(win, 'csrfToken');

        expect(win.neos.use).to.be.an('function');
    });
});
