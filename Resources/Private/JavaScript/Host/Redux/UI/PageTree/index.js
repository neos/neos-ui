import {createAction} from 'redux-actions';
import {$all, $set, $override} from 'plow-js';

const ADD = '@packagefactory/guevara/UI/PageTree/ADD';
const COMMENCE_UNCOLLAPSE = '@packagefactory/guevara/UI/PageTree/COMMENCE_UNCOLLAPSE';
const UNCOLLAPSE = '@packagefactory/guevara/UI/PageTree/UNCOLLAPSE';
const COLLAPSE = '@packagefactory/guevara/UI/PageTree/COLLAPSE';
const INVALIDATE = '@packagefactory/guevara/UI/PageTree/INVALIDATE';
const REQUEST_CHILDREN = '@packagefactory/guevara/UI/PageTree/REQUEST_CHILDREN';

//
// Export the action types
//
export const actionTypes = {
    ADD,
    COMMENCE_UNCOLLAPSE,
    UNCOLLAPSE,
    COLLAPSE,
    INVALIDATE,
    REQUEST_CHILDREN
};

const add = createAction(ADD, (contextPath, node) => ({contextPath, node}));
const commenceUncollapse = createAction(COMMENCE_UNCOLLAPSE, contextPath => ({contextPath}));
const uncollapse = createAction(UNCOLLAPSE, contextPath => ({contextPath}));
const collapse = createAction(COLLAPSE, contextPath => ({contextPath}));
const invalidate = createAction(INVALIDATE, contextPath => ({contextPath}));
const requestChildren = createAction(REQUEST_CHILDREN, contextPath => ({contextPath}));

//
// Export the actions
//
export const actions = {
    add,
    commenceUncollapse,
    uncollapse,
    invalidate,
    requestChildren
};

//
// Export the initial state
//
export const initialState = {
    isLoading: false,
    hasError: false,
    nodesByContextPath: {}
};

//
// Export the reducer
//
export const reducer = {
    [ADD]: ({contextPath, node}) => $set(['ui', 'pageTree', 'nodesByContextPath', contextPath], node),
    [UNCOLLAPSE]: ({contextPath}) => $all(
        $set('ui.pageTree.isLoading', false),
        $override(['ui', 'pageTree', 'nodesByContextPath', contextPath], {
            isLoading: false,
            isCollapsed: false
        })
    ),
    [COLLAPSE]: ({contextPath}) => $all(
        $set('ui.pageTree.isLoading', false),
        $override(['ui', 'pageTree', 'nodesByContextPath', contextPath], {
            isLoading: false,
            isCollapsed: true
        })
    ),
    [INVALIDATE]: ({contextPath}) => $all(
        $set('ui.pageTree.isLoading', false),
        $set('ui.pageTree.hasError', true),
        $override(['ui', 'pageTree', 'nodesByContextPath', contextPath], {
            isLoading: false,
            hasError: true,
            isCollapsed: true
        })
    ),
    [REQUEST_CHILDREN]: ({contextPath}) => $all(
        $set('ui.pageTree.isLoading', true),
        $set(['ui', 'pageTree', 'nodesByContextPath', contextPath, 'isLoading'], true)
    )
};
