import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import reducers, {toggleAutoPublishing} from './index.js';

const expect = chai.expect;

describe('"user.settings" ', () => {
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

        it('should initially mark the auto publishing mode as deactivated.', () => {
            expect(store.getState().get('isAutoPublishingEnabled')).to.equal(false);
        });
    });

    describe('"toggleAutoPublishing" action.', () => {
        it('should be able to reverse the value of the "isAutoPublishingEnabled" key.', () => {
            store.dispatch(toggleAutoPublishing());

            expect(store.getState().get('isAutoPublishingEnabled')).to.equal(true);

            store.dispatch(toggleAutoPublishing());

            expect(store.getState().get('isAutoPublishingEnabled')).to.equal(false);
        });
    });
});
