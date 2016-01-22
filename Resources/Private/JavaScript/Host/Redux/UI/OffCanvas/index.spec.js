import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import reducers, {toggle, hide} from './index.js';

const expect = chai.expect;

describe('"ui.offCanvas" ', () => {
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

        it('should initially mark the offCanvas container as hidden.', () => {
            expect(store.getState().get('isHidden')).to.equal(true);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isHidden" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().get('isHidden')).to.equal(false);

            store.dispatch(toggle());

            expect(store.getState().get('isHidden')).to.equal(true);
        });
    });

    describe('"hide" action.', () => {
        it('should set the "isHidden" key to "false".', () => {
            store.dispatch(hide());

            expect(store.getState().get('isHidden')).to.equal(true);

            store.dispatch(toggle());
            store.dispatch(hide());

            expect(store.getState().get('isHidden')).to.equal(true);
        });
    });
});
