import {createStore} from 'redux';
import {reducer, actions, initialState, errorMessages} from './index.js';

import {handleActions} from 'Shared/Utilities/index';

const {open, close} = actions;

describe('"host.redux.ui.addNodeModal" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    addNodeModal: initialState
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

            expect(state.ui.addNodeModal).to.be.an('object');
        });

        it('modal should initially be closed.', () => {
            const state = store.getState();

            expect(state.ui.addNodeModal.referenceNode).to.equal('');
        });
    });

    describe('"open" action.', () => {
        it('should set "referenceNode" key.', () => {
            store.dispatch(open('someContextPath', 'append'));

            expect(store.getState().ui.addNodeModal.referenceNode).to.equal('someContextPath');
        });

        it('should set "mode" key.', () => {
            store.dispatch(open('someContextPath', 'append'));

            expect(store.getState().ui.addNodeModal.mode).to.equal('append');
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

            expect(store.getState().ui.addNodeModal.referenceNode).to.equal('');
        });
    });
});
