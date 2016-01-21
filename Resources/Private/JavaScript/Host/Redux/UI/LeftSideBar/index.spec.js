import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import reducers, {toggle} from './index.js';

const expect = chai.expect;

describe('"leftSideBar" ', () => {
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

        it('should initially mark the sidebar as hidden.', () => {
            expect(store.getState().get('isHidden')).to.equal(false);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isHidden" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().get('isHidden')).to.equal(true);

            store.dispatch(toggle());

            expect(store.getState().get('isHidden')).to.equal(false);
        });
    });
});
