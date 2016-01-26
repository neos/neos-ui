import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import {reducer, actions} from './index.js';

const {toggle} = actions;
const {expect} = chai;

describe('"host.redux.ui.fullScreen" ', () => {
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

        it('should initially set fullscreen mode to off.', () => {
            expect(store.getState().get('isFullScreen')).to.equal(false);
        });
    });

    describe('"toggle" action.', () => {
        it('should be able to reverse the value of the "isFullScreen" key.', () => {
            store.dispatch(toggle());

            expect(store.getState().get('isFullScreen')).to.equal(true);

            store.dispatch(toggle());

            expect(store.getState().get('isFullScreen')).to.equal(false);
        });
    });
});
