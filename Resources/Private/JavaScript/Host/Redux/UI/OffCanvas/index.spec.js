import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

const {toggle, hide} = actions;

describe('"host.redux.ui.offCanvas" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    offCanvas: initialState
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

            expect(state).to.be.an('object');
        });

        it('should initially mark the offCanvas container as hidden.', () => {
            const state = store.getState();

            expect(state.ui.offCanvas.isHidden).to.equal(true);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isHidden" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().ui.offCanvas.isHidden).to.equal(false);

            store.dispatch(toggle());

            expect(store.getState().ui.offCanvas.isHidden).to.equal(true);
        });
    });

    describe('"hide" action.', () => {
        it('should set the "isHidden" key to "false".', () => {
            store.dispatch(hide());

            expect(store.getState().ui.offCanvas.isHidden).to.equal(true);

            store.dispatch(toggle());
            store.dispatch(hide());

            expect(store.getState().ui.offCanvas.isHidden).to.equal(true);
        });
    });
});
