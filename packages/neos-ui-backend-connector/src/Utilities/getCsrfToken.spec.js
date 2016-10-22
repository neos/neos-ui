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
