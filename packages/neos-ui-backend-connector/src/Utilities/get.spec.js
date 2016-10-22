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
