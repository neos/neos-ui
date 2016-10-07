import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, actions, hydrate} from './index.js';

const {toggle} = actions;

describe('"host.redux.ui.rightSideBar" ', () => {
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

            expect(state.get('ui').get('rightSideBar')).to.be.an.instanceOf(Map);
        });

        it('should initially mark the sidebar as hidden.', () => {
            const state = store.getState();

            expect(state.get('ui').get('rightSideBar').get('isHidden')).to.equal(false);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isHidden" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().get('ui').get('rightSideBar').get('isHidden')).to.equal(true);

            store.dispatch(toggle());

            expect(store.getState().get('ui').get('rightSideBar').get('isHidden')).to.equal(false);
        });
    });
});
