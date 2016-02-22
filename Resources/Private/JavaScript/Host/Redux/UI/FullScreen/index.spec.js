import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

const {toggle} = actions;

describe('"host.redux.ui.fullScreen" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    fullScreen: initialState
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

            expect(state.ui.fullScreen).to.be.an('object');
        });

        it('should initially set fullscreen mode to off.', () => {
            const state = store.getState();

            expect(state.ui.fullScreen.isFullScreen).to.equal(false);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isFullScreen" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().ui.fullScreen.isFullScreen).to.equal(true);

            store.dispatch(toggle());

            expect(store.getState().ui.fullScreen.isFullScreen).to.equal(false);
        });
    });
});
