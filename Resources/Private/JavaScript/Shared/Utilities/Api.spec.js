import * as api from './Api.js';

describe('"shared.utilities.api"', () => {
    describe('"get"', () => {
        it('should be exposed as a function.', () => {
            expect(api.get).to.be.a('function');
        });

        it('should return the `neos` property of the given context.', () => {
            const neos = {};
            const context = {neos};

            expect(api.get(context)).to.equal(neos);
        });

        it('should return an empty object in case no `neos` property was found within the given context.', () => {
            const context = {};

            expect(api.get(context)).to.be.an('object');
        });
    });

    describe('"getCsrfToken"', () => {
        it('should be exposed as a function.', () => {
            expect(api.getCsrfToken).to.be.a('function');
        });

        it('should call and return value of the `csrfToken` within the given `neos` context.', () => {
            const token = 'foo';
            const neos = {csrfToken: () => token};
            const context = {neos};

            expect(api.getCsrfToken(context)).to.equal(token);
        });

        it('should call and return value of the `csrfToken` within the given `neos` context.', () => {
            const token = 'foo';
            const neos = {csrfToken: () => token};
            const context = {neos};

            expect(api.getCsrfToken(context)).to.equal(token);
        });

        it('should throw an error in case the CSRF token cannot be returned.', () => {
            const fn = () => api.getCsrfToken();

            expect(fn).to.throw(api.ERROR_UNABLE_RETRIEVE_CSRF);
        });
    });
});
