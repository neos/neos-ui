import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, hydrate} from './index.js';

describe('"host.redux.user.name" ', () => {
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

            expect(state.get('user').get('name')).to.be.an.instanceOf(Map);
        });

        it('should initially contain placeholder data.', () => {
            const state = store.getState();

            expect(state.get('user').get('name').toJS()).to.deep.equal({
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
