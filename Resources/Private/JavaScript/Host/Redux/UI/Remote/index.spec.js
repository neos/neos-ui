import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import reducers, {
    startSaving,
    finishSaving,
    startPublishing,
    finishPublishing,
    startDiscarding,
    finishDiscarding
} from './index.js';

const expect = chai.expect;

describe('"host.redux.ui.remote" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(reducers);

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return a immutable map as the initial state.', () => {
            expect(store.getState()).to.be.an.instanceof(Immutable.Map);
        });

        it('should initially mark the remotes state as inactive.', () => {
            const state = store.getState();

            expect(state.get('isSaving')).to.equal(false);
            expect(state.get('isPublishing')).to.equal(false);
            expect(state.get('isDiscarding')).to.equal(false);
        });
    });

    describe('"startSaving" action.', () => {
        it('should set the value of the "isSaving" key to "true".', () => {
            store.dispatch(startSaving());

            expect(store.getState().get('isSaving')).to.equal(true);
        });
    });

    describe('"finishSaving" action.', () => {
        it('should set the value of the "isSaving" key to "false".', () => {
            store.dispatch(startSaving());

            expect(store.getState().get('isSaving')).to.equal(true);

            store.dispatch(finishSaving());

            expect(store.getState().get('isSaving')).to.equal(false);
        });
    });

    describe('"startPublishing" action.', () => {
        it('should set the value of the "isPublishing" key to "true".', () => {
            store.dispatch(startPublishing());

            expect(store.getState().get('isPublishing')).to.equal(true);
        });
    });

    describe('"finishPublishing" action.', () => {
        it('should set the value of the "isPublishing" key to "false".', () => {
            store.dispatch(startPublishing());

            expect(store.getState().get('isPublishing')).to.equal(true);

            store.dispatch(finishPublishing());

            expect(store.getState().get('isPublishing')).to.equal(false);
        });
    });

    describe('"startDiscarding" action.', () => {
        it('should set the value of the "isDiscarding" key to "true".', () => {
            store.dispatch(startDiscarding());

            expect(store.getState().get('isDiscarding')).to.equal(true);
        });
    });

    describe('"finishDiscarding" action.', () => {
        it('should set the value of the "isDiscarding" key to "false".', () => {
            store.dispatch(startDiscarding());

            expect(store.getState().get('isDiscarding')).to.equal(true);

            store.dispatch(finishDiscarding());

            expect(store.getState().get('isDiscarding')).to.equal(false);
        });
    });
});
