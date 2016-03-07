import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

const {add} = actions;

describe('"host.redux.transient.nodes" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                cr: {
                    nodes: initialState
                }
            }
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return an object as the initial state.', () => {
            const state = store.getState();

            expect(state.cr.nodes).to.be.an('object');
        });
    });

    describe('"add" action.', () => {
        it('should add the passed data as a new node item to the "byContextPath" state.', () => {
            const contextPath = '/path/top/my/node@user-username;language=en_US';

            store.dispatch(add(contextPath, {
                foo: 'bar'
            }));

            const addedItem = store.getState().cr.nodes.byContextPath[contextPath];

            expect(addedItem).to.not.be.an('undefined');
            expect(addedItem).to.deep.equal({
                foo: 'bar'
            });
        });
    });
});
