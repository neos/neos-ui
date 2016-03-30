import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Utilities/';

const {writeValue, cancel} = actions;

describe('"host.redux.ui.inspector" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    inspector: initialState
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

            expect(state.ui.inspector).to.be.an('object');
        });
    });

    describe('"writeValue" action.', () => {
        it('should store the last modification.', () => {
            store.dispatch(writeValue('/my/path@user-foo', 'test', 'value'));
            expect(store.getState().ui.inspector.valuesByNodePath['/my/path@user-foo'].test).to.equal('value');

            store.dispatch(writeValue('/my/path@user-foo', 'test', 'new value'));
            expect(store.getState().ui.inspector.valuesByNodePath['/my/path@user-foo'].test).to.equal('new value');
        });
    });

    describe('"cancel" action.', () => {
        it('should cancel all modifications.', () => {
            store.dispatch(writeValue('/my/path@user-foo', 'test', 'value'));
            expect(store.getState().ui.inspector.valuesByNodePath['/my/path@user-foo'].test).to.equal('value');

            store.dispatch(cancel('/my/path@user-foo'));
            expect(store.getState().ui.inspector.valuesByNodePath['/my/path@user-foo']).to.equal(undefined);
        });
    });
});
