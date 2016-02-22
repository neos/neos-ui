import {createStore} from 'redux';
import {reducer, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

describe('"host.redux.user.name" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                user: {
                    name: initialState
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

            expect(state.user.name).to.be.an('object');
        });

        it('should initially contain placeholder data.', () => {
            const state = store.getState();

            expect(state.user.name).to.deep.equal({
                title: '',
                firstName: '',
                middleName: '',
                lastName: '',
                otherName: '',
                fullName: ''
            });
        });
    });
});
