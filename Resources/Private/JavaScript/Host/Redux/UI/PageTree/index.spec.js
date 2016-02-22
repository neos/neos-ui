import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

const {setData, setSubTree, setNode} = actions;

describe('"host.redux.ui.pageTree" ', () => {
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

    describe('"setData" action.', () => {
        it('should replace the initial state with the given argument.', () => {
            store.dispatch(setData({
                node: {}
            }));

            const state = store.getState();

            expect(Object.keys(state.ui.pageTree).length).to.equal(1);
            expect(state.ui.pageTree).to.deep.equal({
                node: {}
            });
        });
    });

    describe('"setSubTree" action.', () => {
        it('should set the given data as the contents of the given object path.', () => {
            store.dispatch(setData({
                node: {}
            }));

            store.dispatch(setSubTree('node', {
                children: {}
            }));

            const state = store.getState();

            expect(state.ui.pageTree.node.children).to.not.be.an('undefined');
            expect(state.ui.pageTree.node).to.deep.equal({
                children: {}
            });
        });
    });

    describe('"setNode" action.', () => {
        it('should replace the given data as the contents of the given object path.', () => {
            store.dispatch(setData({
                node: {
                    children: {}
                }
            }));

            const data = {
                foo: 'bar'
            };
            store.dispatch(setNode('node', data));

            const state = store.getState();

            expect(state.ui.pageTree.node).to.not.be.an('undefined');
            expect(state.ui.pageTree).to.deep.equal({
                node: {
                    foo: 'bar'
                }
            });
        });
    });
});
