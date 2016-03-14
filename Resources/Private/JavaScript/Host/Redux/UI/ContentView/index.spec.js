import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Utilities/index';

const {
    setContextPath,
    setSrc
} = actions;

describe('"host.redux.ui.contentView" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    pageTree: initialState
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

            expect(state.ui.pageTree).to.be.an('object');
        });
    });

    describe('"setContextPath" action.', () => {
        it('should set the currently opened documents context path.', () => {
            store.dispatch(setContextPath('someContextPath'));

            const state = store.getState();

            expect(state.ui.contentView.contextPath).to.equal('someContextPath');
        });
    });

    describe('"setSrc" action.', () => {
        it('should set the currently opened documents src uri.', () => {
            store.dispatch(setSrc('http://www.some-source.com/document.html'));

            const state = store.getState();

            expect(state.ui.contentView.src).to.equal('http://www.some-source.com/document.html');
        });
    });
});
