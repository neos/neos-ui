import chai from 'chai';
import Immutable from 'immutable';
import {createStore} from 'redux';
import reducers, {
    add,
    remove,
    switchTo,
    setMetaData,
    updateWorkspaceInfo
} from './index.js';

const expect = chai.expect;

describe('"Tabs" ', () => {
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

        it('should initially contain a state structure.', () => {
            const state = store.getState();
            const active = state.get('active');
            const workspace = active.get('workspace');
            const publishingState = workspace.get('publishingState');

            expect(state.get('byId')).to.be.an.instanceof(Immutable.Map);
            expect(active).to.be.an.instanceof(Immutable.Map);
            expect(active.get('id')).to.not.be.an('undefined');
            expect(workspace).to.be.an.instanceof(Immutable.Map);
            expect(workspace.get('name')).to.not.be.an('undefined');
            expect(publishingState).to.be.an.instanceof(Immutable.Map);
            expect(publishingState.get('publishableNodes')).to.be.an.instanceof(Immutable.List);
            expect(publishingState.get('publishableNodesInDocument')).to.be.an.instanceof(Immutable.List);
        });
    });

    describe('"add" action.', () => {
        it('should add the given src to the store.', () => {
            store.dispatch(add('myTabId', 'http://127.0.0.1/'));

            const tabData = store.getState().get('byId').get('myTabId');

            expect(tabData).to.be.an.instanceof(Immutable.Map);
            expect(tabData.get('id')).to.equal('myTabId');
        });

        it('should add a placeholder as the titel to the newly created tab.', () => {
            store.dispatch(add('myTabId', 'http://127.0.0.1/'));

            expect(store.getState().get('byId').get('myTabId').get('title')).to.equal('...');
        });

        it('should add initial workspace data to the newly created tab.', () => {
            store.dispatch(add('myTabId', 'http://127.0.0.1/'));

            const workspace = store.getState().get('byId').get('myTabId').get('workspace');
            const publishingState = workspace.get('publishingState');

            expect(workspace).to.be.an.instanceof(Immutable.Map);
            expect(workspace.get('name')).to.not.be.an('undefined');
            expect(publishingState).to.be.an.instanceof(Immutable.Map);
            expect(publishingState.get('publishableNodes')).to.be.an.instanceof(Immutable.List);
            expect(publishingState.get('publishableNodesInDocument')).to.be.an.instanceof(Immutable.List);
        });
    });

    describe('"remove" action.', () => {
        it('should remove the given tabId from the store.', () => {
            store.dispatch(add('myTabId', 'http://127.0.0.1/'));
            store.dispatch(remove('myTabId'));

            const tabData = store.getState().get('byId').get('myTabId');

            expect(tabData).to.be.an('undefined');
        });
    });

    describe('"switchTo" action.', () => {
        it('should set the the given tabId tab data to the "active" state map.', () => {
            store.dispatch(add('myTabId', 'http://127.0.0.1/'));
            store.dispatch(add('anotherTabId', 'http://127.0.0.1/test'));

            store.dispatch(switchTo('myTabId'));

            const activeTab = store.getState().get('active');

            expect(activeTab).to.be.an.instanceof(Immutable.Map);
            expect(activeTab.get('id')).to.equal('myTabId');
        });
    });
});
