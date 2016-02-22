import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

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
        it('should return an array as the initial state.', () => {
            const state = store.getState();

            expect(state.changes).to.be.an('array');
        });
    });

    describe('"add" action.', () => {
        it('should add the passed data as a new change item to the state.', () => {
            store.dispatch(add(changeFixture));

            expect(store.getState().changes.length).to.equal(1);
            expect(store.getState().changes[0]).to.deep.equal(changeFixture);
        });
    });

    describe('"clear" action.', () => {
        it('should be able to remove all added added changes.', () => {
            store.dispatch(add(changeFixture));
            store.dispatch(clear());

            expect(store.getState().changes.length).to.equal(0);
        });
    });
});
