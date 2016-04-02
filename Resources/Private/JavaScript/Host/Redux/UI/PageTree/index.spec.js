import {createStore} from 'redux';
import {Map, Set} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';

import {reducer, actions, hydrate} from './index.js';

const {
    focus,
    uncollapse,
    collapse,
    invalidate,
    requestChildren
} = actions;

describe('"host.redux.ui.pageTree" ', () => {
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

            expect(state.get('ui').get('pageTree')).to.be.an.instanceOf(Map);
        });
    });

    describe('"focus" action.', () => {
        it('should set the focused node context path.', () => {
            store.dispatch(focus('someContextPath'));

            const state = store.getState();

            expect(state.get('ui').get('pageTree').get('focused')).to.equal('someContextPath');
        });
    });

    describe('"uncollapse" action.', () => {
        const initialize = () => createStore(
            handleActions(reducer),
            $set(
                'ui.pageTree',
                new Map({
                    focused: '',
                    uncollapsed: new Set(),
                    loading: new Set(['someContextPath']),
                    errors: new Set(['someContextPath'])
                }),
                new Map()
            )
        );

        it('should remove the given node from error state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(true);

            store.dispatch(uncollapse('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(false);
        });

        it('should remove the given node from loading state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(true);

            store.dispatch(uncollapse('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(false);
        });

        it('should add the given node to uncollapsed state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(false);

            store.dispatch(uncollapse('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(true);
        });
    });

    describe('"collapse" action.', () => {
        const initialize = () => createStore(
            handleActions(reducer),
            $set(
                'ui.pageTree',
                new Map({
                    focused: '',
                    uncollapsed: new Set(['someContextPath']),
                    loading: new Set(['someContextPath']),
                    errors: new Set(['someContextPath'])
                }),
                new Map()
            )
        );

        it('should remove the given node from error state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(true);

            store.dispatch(collapse('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(false);
        });

        it('should remove the given node from loading state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(true);

            store.dispatch(collapse('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(false);
        });

        it('should remove the given node from uncollapsed state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(true);

            store.dispatch(collapse('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(false);
        });
    });

    describe('"invalidate" action.', () => {
        const initialize = () => createStore(
            handleActions(reducer),
            $set(
                'ui.pageTree',
                new Map({
                    focused: '',
                    uncollapsed: new Set(['someContextPath']),
                    loading: new Set(['someContextPath']),
                    errors: new Set()
                }),
                new Map()
            )
        );

        it('should remove the given node from uncollapsed state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(true);

            store.dispatch(invalidate('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(false);
        });

        it('should remove the given node from loading state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(true);

            store.dispatch(invalidate('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(false);
        });

        it('should add the given node to error state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(false);

            store.dispatch(invalidate('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(true);
        });
    });

    describe('"requestChildren" action.', () => {
        const initialize = () => createStore(
            handleActions(reducer),
            $set(
                'ui.pageTree',
                new Map({
                    focused: '',
                    uncollapsed: new Set(['someContextPath']),
                    loading: new Set([]),
                    errors: new Set(['someContextPath'])
                }),
                new Map()
            )
        );

        it('should remove the given node from error state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(true);

            store.dispatch(requestChildren('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('errors').contains('someContextPath')).to.equal(false);
        });

        it('should remove the given node from uncollapsed state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(true);

            store.dispatch(requestChildren('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('uncollapsed').contains('someContextPath')).to.equal(false);
        });

        it('should add the given node to loading state', () => {
            const store = initialize();
            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(false);

            store.dispatch(requestChildren('someContextPath'));

            expect(store.getState().get('ui').get('pageTree').get('loading').contains('someContextPath')).to.equal(true);
        });
    });
});
