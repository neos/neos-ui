import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$all, $set, $override} from 'plow-js';

const ADD = '@packagefactory/guevara/UI/PageTree/ADD';
const FOCUS = '@packagefactory/guevara/UI/PageTree/FOCUS';
const COMMENCE_UNCOLLAPSE = '@packagefactory/guevara/UI/PageTree/COMMENCE_UNCOLLAPSE';
const UNCOLLAPSE = '@packagefactory/guevara/UI/PageTree/UNCOLLAPSE';
const COLLAPSE = '@packagefactory/guevara/UI/PageTree/COLLAPSE';
const TOGGLE = '@packagefactory/guevara/UI/PageTree/TOGGLE';
const INVALIDATE = '@packagefactory/guevara/UI/PageTree/INVALIDATE';
const REQUEST_CHILDREN = '@packagefactory/guevara/UI/PageTree/REQUEST_CHILDREN';

//
// Export the action types
//
export const actionTypes = {
    ADD,
    FOCUS,
    COMMENCE_UNCOLLAPSE,
    UNCOLLAPSE,
    COLLAPSE,
    TOGGLE,
    INVALIDATE,
    REQUEST_CHILDREN
};

const add = createAction(ADD, (contextPath, node) => ({contextPath, node}));
const focus = createAction(FOCUS, contextPath => ({contextPath}));
const commenceUncollapse = createAction(COMMENCE_UNCOLLAPSE, contextPath => ({contextPath}));
const uncollapse = createAction(UNCOLLAPSE, contextPath => ({contextPath}));
const collapse = createAction(COLLAPSE, contextPath => ({contextPath}));
const toggle = createAction(TOGGLE, contextPath => ({contextPath}));
const invalidate = createAction(INVALIDATE, contextPath => ({contextPath}));
const requestChildren = createAction(REQUEST_CHILDREN, contextPath => ({contextPath}));

//
// Export the actions
//
export const actions = {
    add,
    focus,
    commenceUncollapse,
    uncollapse,
    collapse,
    toggle,
    invalidate,
    requestChildren
};

//
// Export the initial state hydrator
//
export const hydrate = () => new Map({
    ui: new Map({
        pageTree: new Map({
            isLoading: false,
            hasError: false,
            focused: '',
            nodesByContextPath: new Map()
        })
    })
});

//
// Export the reducer
//
export const reducer = {
    [ADD]: ({contextPath, node}) => $set(['ui', 'pageTree', 'nodesByContextPath', contextPath], node),
    [FOCUS]: ({contextPath}) => $set('ui.pageTree.focused', contextPath),
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
