import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Utilities/';

describe('"host.redux.cr.dimensions" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                cr: {
                    dimensions: initialState
                }
            }
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });

    describe.only('reducer.', () => {
        it('should return an object as the initial state.', () => {
            const state = store.getState();

            expect(state.cr.dimensions).to.be.an('object');
        });
        it('should equal this object', () => {
            const state = store.getState();

            expect(state.cr.dimensions).to.deep.equal({myvar: 'test'});
        });
    });
});
