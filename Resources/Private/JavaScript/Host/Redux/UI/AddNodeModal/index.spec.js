import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, actions, hydrate, errorMessages} from './index.js';

const {open, close} = actions;

describe('"host.redux.ui.addNodeModal" ', () => {
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

            expect(state.get('ui').get('addNodeModal')).to.be.an.instanceOf(Map);
        });

        it('modal should initially be closed.', () => {
            const state = store.getState();

            expect(state.get('ui').get('addNodeModal').get('referenceNode')).to.equal('');
        });
    });

    describe('"open" action.', () => {
        it('should set "referenceNode" key.', () => {
            store.dispatch(open('someContextPath', 'append'));

            expect(store.getState().get('ui').get('addNodeModal').get('referenceNode')).to.equal('someContextPath');
        });

        it('should set "mode" key.', () => {
            store.dispatch(open('someContextPath', 'append'));

            expect(store.getState().get('ui').get('addNodeModal').get('mode')).to.equal('append');
        });

        it('should throw on incorrect mode.', () => {
            const fn = () => store.dispatch(open('someContextPath', 'appendBlahBlah'));

            expect(fn).to.throw(errorMessages.ERROR_INVALID_MODE);
        });

        it('should throw on missing referenceNode.', () => {
            const fn = () => store.dispatch(open());

            expect(fn).to.throw(errorMessages.ERROR_INVALID_CONTEXTPATH);
        });
    });

    describe('"close" action.', () => {
        it('should set "isOpen" key to false.', () => {
            store.dispatch(close());

            expect(store.getState().get('ui').get('addNodeModal').get('referenceNode')).to.equal('');
        });
    });
});
