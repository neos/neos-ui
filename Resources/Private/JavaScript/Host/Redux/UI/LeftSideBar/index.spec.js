import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

const {toggle} = actions;

describe('"host.redux.ui.leftSideBar" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    leftSideBar: initialState
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

            expect(state.ui.leftSideBar).to.be.an('object');
        });

        it('should initially mark the sidebar as visible.', () => {
            const state = store.getState();

            expect(state.ui.leftSideBar.isHidden).to.equal(false);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isHidden" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().ui.leftSideBar.isHidden).to.equal(true);

            store.dispatch(toggle());

            expect(store.getState().ui.leftSideBar.isHidden).to.equal(false);
        });
    });
});
