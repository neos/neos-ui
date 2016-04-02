import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, actions, hydrate} from './index.js';

const {toggle} = actions;

describe('"host.redux.ui.fullScreen" ', () => {
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

            expect(state.get('ui').get('fullScreen')).to.be.an.instanceOf(Map);
        });

        it('should initially set fullscreen mode to off.', () => {
            const state = store.getState();

            expect(state.get('ui').get('fullScreen').get('isFullScreen')).to.equal(false);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isFullScreen" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().get('ui').get('fullScreen').get('isFullScreen')).to.equal(true);

            store.dispatch(toggle());

            expect(store.getState().get('ui').get('fullScreen').get('isFullScreen')).to.equal(false);
        });
    });
});
