import Immutable from 'immutable';
import {createStore} from 'redux';
import {reducer, actions} from './index.js';

const {add, clear} = actions;

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
        store = createStore(reducer);

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe('reducer.', () => {
        it('should return a immutable list as the initial state.', () => {
            const state = store.getState();

            expect(state).to.be.an.instanceof(Immutable.List);
        });
    });

    describe('"add" action.', () => {
        it('should add the passed data as a new change item to the state.', () => {
            store.dispatch(add(changeFixture));

            expect(store.getState().count()).to.equal(1);
        });
    });

    describe('"clear" action.', () => {
        it('should be able to remove all added added changes.', () => {
            store.dispatch(add(changeFixture));
            store.dispatch(clear());

            expect(store.getState().count()).to.equal(0);
        });
    });
});
