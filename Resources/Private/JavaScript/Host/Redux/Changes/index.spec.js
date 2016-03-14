import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Utilities/index';

const {add, flush, finish, fail, retry} = actions;

describe('"host.redux.transient.changes" ', () => {
    const changeFixture = {
        type: 'PackageFactory.Guevara:Property',
        subject: '/sites/neosdemotypo3org/teaser/node52697bdfee199@user-admin;language=en_US',
        payload: {
            propertyName: 'title',
            value: '<h1>&nbsp;ssd Ceate cftent.</h1>'
        }
    };
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                changes: initialState
            }
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return the initial state to be of the right shape.', () => {
            const state = store.getState();

            expect(state.changes.pending).to.be.an('array');
            expect(state.changes.processing).to.be.an('array');
            expect(state.changes.failed).to.be.an('array');
        });
    });

    describe('"add" action.', () => {
        it('should add the passed data as a new change item to the state.', () => {
            store.dispatch(add(changeFixture));

            expect(store.getState().changes.pending.length).to.equal(1);
            expect(store.getState().changes.pending[0]).to.deep.equal(changeFixture);
        });
    });

    describe('"flush" action.', () => {
        it('should move all pending changes to processing state.', () => {
            store.dispatch(add(changeFixture));
            store.dispatch(flush());
            expect(store.getState().changes.pending.length).to.equal(0);
            expect(store.getState().changes.processing.length).to.equal(1);
        });
    });
    describe('"finish" action.', () => {
        it('should clear all changes from processing state.', () => {
            store.dispatch(add(changeFixture));
            store.dispatch(flush());
            store.dispatch(finish());

            expect(store.getState().changes.pending.length).to.equal(0);
            expect(store.getState().changes.processing.length).to.equal(0);
        });
    });
    describe('"fail" action.', () => {
        it('should move all changes from processing state to failed.', () => {
            store.dispatch(add(changeFixture));
            store.dispatch(flush());
            store.dispatch(fail());

            expect(store.getState().changes.failed.length).to.equal(1);
            expect(store.getState().changes.processing.length).to.equal(0);
        });
    });
    describe('"retry" action.', () => {
        it('should move all changes from failed state to pending.', () => {
            store.dispatch(add(changeFixture));
            store.dispatch(flush());
            store.dispatch(fail());
            store.dispatch(retry());

            expect(store.getState().changes.failed.length).to.equal(0);
            expect(store.getState().changes.processing.length).to.equal(0);
            expect(store.getState().changes.pending.length).to.equal(1);
        });
    });
});
