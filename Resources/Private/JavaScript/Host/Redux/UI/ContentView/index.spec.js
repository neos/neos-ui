import {createStore} from 'redux';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, actions, hydrate} from './index.js';

const {
    setContextPath,
    setSrc
} = actions;

describe('"host.redux.ui.contentView" ', () => {
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

            expect(state.get('ui').get('contentView')).to.be.an.instanceOf(Map);
        });
    });

    describe('"setContextPath" action.', () => {
        it('should set the currently opened documents context path.', () => {
            store.dispatch(setContextPath('someContextPath'));

            const state = store.getState();

            expect(state.get('ui').get('contentView').get('contextPath')).to.equal('someContextPath');
        });
    });

    describe('"setSrc" action.', () => {
        it('should set the currently opened documents src uri.', () => {
            store.dispatch(setSrc('http://www.some-source.com/document.html'));

            const state = store.getState();

            expect(state.get('ui').get('contentView').get('src')).to.equal('http://www.some-source.com/document.html');
        });
    });
});
