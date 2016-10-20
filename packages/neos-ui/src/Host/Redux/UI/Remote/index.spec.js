import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from '@neos-project/utils-redux';

import {reducer, actions, hydrate} from './index.js';

const {
    startSaving,
    finishSaving,
    startPublishing,
    finishPublishing,
    startDiscarding,
    finishDiscarding
} = actions;

describe('"host.redux.ui.remote" ', () => {
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

            expect(state.get('ui').get('remote')).to.be.an.instanceOf(Map);
        });

        it('should initially mark the remotes state as inactive.', () => {
            const state = store.getState();

            expect(state.get('ui').get('remote').get('isSaving')).to.equal(false);
            expect(state.get('ui').get('remote').get('isPublishing')).to.equal(false);
            expect(state.get('ui').get('remote').get('isDiscarding')).to.equal(false);
        });
    });

    describe('"startSaving" action.', () => {
        it('should set the value of the "isSaving" key to "true".', () => {
            store.dispatch(startSaving());

            const state = store.getState();

            expect(state.get('ui').get('remote').get('isSaving')).to.equal(true);
        });
    });

    describe('"finishSaving" action.', () => {
        it('should set the value of the "isSaving" key to "false".', () => {
            store.dispatch(startSaving());
            store.dispatch(finishSaving());

            const state = store.getState();

            expect(state.get('ui').get('remote').get('isSaving')).to.equal(false);
        });
    });

    describe('"startPublishing" action.', () => {
        it('should set the value of the "isPublishing" key to "true".', () => {
            store.dispatch(startPublishing());

            const state = store.getState();

            expect(state.get('ui').get('remote').get('isPublishing')).to.equal(true);
        });
    });

    describe('"finishPublishing" action.', () => {
        it('should set the value of the "isPublishing" key to "false".', () => {
            store.dispatch(startPublishing());
            store.dispatch(finishPublishing());

            const state = store.getState();

            expect(state.get('ui').get('remote').get('isPublishing')).to.equal(false);
        });
    });

    describe('"startDiscarding" action.', () => {
        it('should set the value of the "isDiscarding" key to "true".', () => {
            store.dispatch(startDiscarding());

            const state = store.getState();

            expect(state.get('ui').get('remote').get('isDiscarding')).to.equal(true);
        });
    });

    describe('"finishDiscarding" action.', () => {
        it('should set the value of the "isDiscarding" key to "false".', () => {
            store.dispatch(startDiscarding());
            store.dispatch(finishDiscarding());

            const state = store.getState();

            expect(state.get('ui').get('remote').get('isDiscarding')).to.equal(false);
        });
    });
});
