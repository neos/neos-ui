import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Shared/Utilities/index';

const {
    add,
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

    describe('"add" action.', () => {
        it('should add a node representation to the state.', () => {
            store.dispatch(add('someContextPath', {
                contextPath: 'someContextPath',
                node: 'someNode'
            }));

            const state = store.getState();

            expect(Object.keys(state.ui.pageTree.nodesByContextPath).length).to.equal(1);
            expect(state.ui.pageTree.nodesByContextPath).to.deep.equal({
                someContextPath: {
                    contextPath: 'someContextPath',
                    node: 'someNode'
                }
            });
        });
    });

    describe('"focus" action.', () => {
        it('should set the focused node context path.', () => {
            store.dispatch(focus('someContextPath'));

            const state = store.getState();

            expect(state.ui.pageTree.focused).to.equal('someContextPath');
        });
    });

    describe('"uncollapse" action.', () => {
        const store = createStore(
            handleActions(reducer),
            {
                ui: {
                    pageTree: {
                        isLoading: true,
                        nodesByContextPath: {
                            someContextPath: {
                                isLoading: true,
                                isCollapsed: true
                            }
                        }
                    }
                }
            }
        );

        store.dispatch(uncollapse('someContextPath'));

        it('should set the loading state of the given node to false.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.isLoading).to.equal(false);
        });

        it('should set the collapsed state of the given node to false.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.isCollapsed).to.equal(false);
        });

        it('should set the loading state of the pageTree to false.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.isLoading).to.equal(false);
        });
    });

    describe('"collapse" action.', () => {
        const store = createStore(
            handleActions(reducer),
            {
                ui: {
                    pageTree: {
                        isLoading: true,
                        nodesByContextPath: {
                            someContextPath: {
                                isLoading: true,
                                isCollapsed: false
                            }
                        }
                    }
                }
            }
        );

        store.dispatch(collapse('someContextPath'));

        it('should set the loading state of the given node to false.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.isLoading).to.equal(false);
        });

        it('should set the collapsed state of the given node to true.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.isCollapsed).to.equal(true);
        });

        it('should set the loading state of the pageTree to false.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.isLoading).to.equal(false);
        });
    });

    describe('"invalidate" action.', () => {
        const store = createStore(
            handleActions(reducer),
            {
                ui: {
                    pageTree: {
                        isLoading: true,
                        hasError: false,
                        nodesByContextPath: {
                            someContextPath: {
                                isLoading: true,
                                hasError: false
                            }
                        }
                    }
                }
            }
        );

        store.dispatch(invalidate('someContextPath'));

        it('should set the loading state of the given node to false.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.isLoading).to.equal(false);
        });

        it('should set the error state of the given node to true.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.hasError).to.equal(true);
        });

        it('should set the collapsed state of the given node to true.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.isCollapsed).to.equal(true);
        });

        it('should set the loading state of the pageTree to false.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.isLoading).to.equal(false);
        });

        it('should set the error state of the pageTree to true.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.hasError).to.equal(true);
        });
    });

    describe('"requestChildren" action.', () => {
        const store = createStore(
            handleActions(reducer),
            {
                ui: {
                    pageTree: {
                        isLoading: false,
                        nodesByContextPath: {
                            someContextPath: {
                                isLoading: false
                            }
                        }
                    }
                }
            }
        );

        store.dispatch(requestChildren('someContextPath'));

        it('should set the loading state of the given node to true.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.nodesByContextPath.someContextPath.isLoading).to.equal(true);
        });

        it('should set the loading state of the pageTree to true.', () => {
            const state = store.getState();

            expect(state.ui.pageTree.isLoading).to.equal(true);
        });
    });
});
