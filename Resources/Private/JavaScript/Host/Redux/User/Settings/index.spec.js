import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, actions, hydrate} from './index.js';

const {toggleAutoPublishing} = actions;

describe('"host.redux.user.settings" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            hydrate({})(new Map())
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return an Immutable.Map as the initial state.', () => {
            const state = store.getState();

            expect(state.get('user').get('settings')).to.be.an.instanceOf(Map);
        });

        it('should initially mark the auto publishing mode as deactivated.', () => {
            const state = store.getState();

            expect(state.get('user').get('settings').get('isAutoPublishingEnabled')).to.equal(false);
        });
    });

    describe('"toggleAutoPublishing" action.', () => {
        it('should be able to reverse the value of the "isAutoPublishingEnabled" key.', () => {
            store.dispatch(toggleAutoPublishing());

            expect(store.getState().get('user').get('settings').get('isAutoPublishingEnabled')).to.equal(true);

            store.dispatch(toggleAutoPublishing());

            expect(store.getState().get('user').get('settings').get('isAutoPublishingEnabled')).to.equal(false);
        });
    });
});
