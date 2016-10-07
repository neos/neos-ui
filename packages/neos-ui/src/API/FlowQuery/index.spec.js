import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import sinonChai from 'sinon-chai';
import factory, {
    isStartingOperation,
    isFinishingOperation,
    createNodeEnvelope,
    isNodeEnvelope,
    resolveChain
} from './index.js';

chai.should();
chai.use(sinonChai);

describe('"api.flowQuery"', () => {
    describe('"isStartingOperation" utility', () => {
        it('should return a falsy boolean if no operation object was passed.', () => {
            expect(isStartingOperation()).to.equal(false);
        });

        it('should return a falsy boolean if the given operation is not a type of "CREATE_CONTEXT".', () => {
            expect(isStartingOperation({type: 'FOO'})).to.equal(false);
        });

        it('should return a truthy boolean if the given operation is a type of "CREATE_CONTEXT".', () => {
            expect(isStartingOperation({type: 'CREATE_CONTEXT'})).to.equal(true);
        });
    });

    describe('"isFinishingOperation" utility', () => {
        it('should return a falsy boolean if no operation object was passed.', () => {
            expect(isFinishingOperation()).to.equal(false);
        });

        it('should return a falsy boolean if the given operation is not a type of "GET" or "COUNT".', () => {
            expect(isFinishingOperation({type: 'CREATE_CONTEXT'})).to.equal(false);
        });

        it('should return a truthy boolean if the given operation is a type of "GET".', () => {
            expect(isFinishingOperation({type: 'GET'})).to.equal(true);
        });

        it('should return a truthy boolean if the given operation is a type of "COUNT".', () => {
            expect(isFinishingOperation({type: 'COUNT'})).to.equal(true);
        });
    });

    describe('"createNodeEnvelope" utility', () => {
        it('should throw an error if no argument was passed.', () => {
            const fn = () => createNodeEnvelope();

            expect(fn).to.throw();
        });

        it('should throw an error an array was passed as the argument.', () => {
            const fn = () => createNodeEnvelope([]);

            expect(fn).to.throw();
        });

        it('should return an object containing the contextPath of the passed node if the passed argument is a string.', () => {
            const result = createNodeEnvelope('my.contextPath');

            expect(result).to.have.keys(['$node']);
            expect(result.$node).to.equal('my.contextPath');
        });

        it('should throw an error if the passed object has no "$node" or "contextPath" key/value pair.', () => {
            const fn = () => createNodeEnvelope({foo: 'bar'});

            expect(fn).to.throw();
        });

        it('should return an object containing the contextPath of the passed node if the passed argument is a object containing a "contextPath" key/value pair.', () => {
            const result = createNodeEnvelope({contextPath: 'another.contextPath'});

            expect(result).to.have.keys(['$node']);
            expect(result.$node).to.equal('another.contextPath');
        });

        it('should return an object containing the contextPath of the passed node if the passed argument is a object containing a "$node" key/value pair.', () => {
            const result = createNodeEnvelope({$node: 'yet.another.contextPath'});

            expect(result).to.have.keys(['$node']);
            expect(result.$node).to.equal('yet.another.contextPath');
        });
    });

    describe('"isNodeEnvelope" utility', () => {
        it('should return a falsy boolean if no argument was passed.', () => {
            expect(isNodeEnvelope()).to.equal(false);
        });

        it('should return a falsy boolean if the the passed argument is an array.', () => {
            expect(isNodeEnvelope([])).to.equal(false);
        });

        it('should return a truthy boolean if the the passed argument is an object which does not contain an "$node" key/value pair.', () => {
            expect(isNodeEnvelope({foo: 'bar'})).to.equal(false);
        });

        it('should return a truthy boolean if the passed argument is an object which does contain an "$node" key/value pair.', () => {
            expect(isNodeEnvelope({$node: 'foo'})).to.equal(true);
        });
    });

    describe('"resolveChain" utility', () => {
        it('should return a promise.', () => {
            const result = resolveChain();

            expect(result).to.be.a('promise');
        });
    });

    describe('"api" factory', () => {
        it('should throw an error if no csrfToken was provided.', () => {
            const fn = () => factory();

            expect(fn).to.throw();
        });

        it('should throw an error if an empty csrfToken was provided.', () => {
            const fn = () => factory('');

            expect(fn).to.throw();
        });

        it('should expose the "q" function and its "applyMiddleware" method.', () => {
            const q = factory('csrfToken');

            expect(q).to.be.an('function');
            expect(q.applyMiddleware).to.be.an('function');
        });

        describe('"api"', () => {
            it('should expose all operations as methods of the api.', () => {
                const q = factory('csrfToken');
                const api = q('myContextPath');

                expect(api).to.be.an('object');
                expect(api).to.have.keys(['children', 'get']);
            });

            it('should throw an error if an argument was passed which is not a string, array nor an object with an "contextPath" key/value pair.', () => {
                const q = factory('csrfToken');
                const fn = () => q(2);

                expect(fn).to.throw();
            });

            it('should not throw an error if provided with an object containing an "contextPath" key/value pair.', () => {
                const q = factory('csrfToken');
                const fn = () => q({
                    contextPath: 'myContextPath'
                });

                expect(fn).to.not.throw();
            });

            it('should not throw an error if provided with an string.', () => {
                const q = factory('csrfToken');
                const fn = () => q('myContextPath');

                expect(fn).to.not.throw();
            });

            it('should apply the the given middleware function and call it when executing an operation method.', () => {
                const q = factory('csrfToken');
                const middleware = sinon.spy();

                q.applyMiddleware(middleware);

                q('myContextPath').children('[instanceof TYPO3.Neos:Document]');

                expect(middleware).to.have.callCount(1);
            });

            it('should apply the the given middleware function but ignore it when passing a truthy boolean as the second argument of the API.', () => {
                const q = factory('csrfToken');
                const middleware = sinon.spy();

                q.applyMiddleware(middleware);

                q('myContextPath', true).children('[instanceof TYPO3.Neos:Document]');

                expect(middleware).to.have.callCount(0);
            });
        });
    });
});
