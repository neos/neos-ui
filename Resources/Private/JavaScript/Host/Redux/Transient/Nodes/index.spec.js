import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import {reducer, actions} from './index.js';

const {add, addBulk} = actions;
const {expect} = chai;

describe('"host.redux.transient.nodes" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(reducer);

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return a immutable list as the initial state.', () => {
            const state = store.getState();

            expect(state).to.be.an.instanceof(Immutable.Map);
        });
    });

    describe('"add" action.', () => {
        it('should add the passed data as a new node item to the "byContextPath" state.', () => {
            const contextPath = '/path/top/my/node@user-username;language=en_US';

            store.dispatch(add(contextPath, {
                foo: 'bar'
            }));

            const addedItem = store.getState().get('byContextPath').get(contextPath);

            expect(addedItem).to.not.be.an('undefined');
            expect(addedItem.get('foo')).to.not.be.an('undefined');
        });
    });

    describe('"addBulk" action.', () => {
        it('should merge the passed nodes to the "byContextPath" state.', () => {
            store.dispatch(add('/path/top/my/node@user-username;language=en_US', {
                foo: 'bar'
            }));
            store.dispatch(addBulk({
                '/another/path/to/node@user-username;language=en_US': {
                    foo: 'bar'
                },
                '/yet/another/path/to/node@user-username;language=en_US': {
                    baz: 'bar'
                }
            }));

            const items = store.getState().get('byContextPath');

            expect(items.count()).to.equal(3);
            expect(items.get('/path/top/my/node@user-username;language=en_US')).to.not.be.an('undefined');
            expect(items.get('/another/path/to/node@user-username;language=en_US')).to.not.be.an('undefined');
        });
    });
});
