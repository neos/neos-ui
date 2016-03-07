import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

const {toggleAutoPublishing} = actions;

describe('"host.redux.user.settings" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                user: {
                    settings: initialState
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

            expect(state.user.settings).to.be.an('object');
        });

        it('should initially mark the auto publishing mode as deactivated.', () => {
            const state = store.getState();

            expect(state.user.settings.isAutoPublishingEnabled).to.equal(false);
        });
    });

    describe('"toggleAutoPublishing" action.', () => {
        it('should be able to reverse the value of the "isAutoPublishingEnabled" key.', () => {
            store.dispatch(toggleAutoPublishing());

            expect(store.getState().user.settings.isAutoPublishingEnabled).to.equal(true);

            store.dispatch(toggleAutoPublishing());

            expect(store.getState().user.settings.isAutoPublishingEnabled).to.equal(false);
        });
    });
});
