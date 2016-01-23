import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import {reducer} from './index.js';

const {expect} = chai;

describe('"host.redux.user.name" ', () => {
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
        it('should return a immutable map as the initial state.', () => {
            expect(store.getState()).to.be.an.instanceof(Immutable.Map);
        });

        it('should initially contain placeholder data.', () => {
            const state = store.getState();

            expect(state.get('title')).to.equal('');
            expect(state.get('firstName')).to.equal('');
            expect(state.get('middleName')).to.equal('');
            expect(state.get('lastName')).to.equal('');
            expect(state.get('otherName')).to.equal('');
            expect(state.get('fullName')).to.equal('');
        });
    });
});
