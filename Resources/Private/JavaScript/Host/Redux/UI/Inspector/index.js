import {createAction} from 'redux-actions';
import {$get, $all, $set, $drop, $transform} from 'plow-js';
import Immutable, {Map} from 'immutable';
import {map, mapObjIndexed, values, sort, compose} from 'ramda';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';
import {createSelector} from 'reselect';

import {Nodes} from 'Host/Selectors/CR/index';

//
// System actions
//
const COMMIT = '@packagefactory/guevara/UI/Inspector/COMMIT';
const CLEAR = '@packagefactory/guevara/UI/Inspector/CLEAR';

//
// User actions, which are handled by a saga
//
const APPLY = '@packagefactory/guevara/UI/Inspector/APPLY';
const DISCARD = '@packagefactory/guevara/UI/Inspector/DISCARD';

const commit = createAction(COMMIT, (propertyId, value, hooks) => ({propertyId, value, hooks}));
const clear = createAction(CLEAR);

const apply = createAction(APPLY, () => ({}));
const discard = createAction(DISCARD, () => ({}));

//
// Export the actions
//
export const actions = {
    commit,
    clear,
    apply,
    discard
};

export const actionTypes = {
    COMMIT,
    CLEAR,
    APPLY,
    DISCARD
};

const clearReducer = () => state => {
    const focusedNodePath = Nodes.focusedNodePathSelector(state);
    return $drop(['ui', 'inspector', 'valuesByNodePath', focusedNodePath], state);
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.inspector',
        new Map({
            valuesByNodePath: new Map()
        })
    ),
    [COMMIT]: ({propertyId, value, hooks}) => state => {
        const focusedNodePath = Nodes.focusedNodePathSelector(state);

        if (value !== null) {
            return $set(['ui', 'inspector', 'valuesByNodePath', focusedNodePath, propertyId], Immutable.fromJS({value, hooks}), state);
        }

        return $drop(['ui', 'inspector', 'valuesByNodePath', focusedNodePath, propertyId], state);
    },

    [DISCARD]: clearReducer,
    [CLEAR]: clearReducer
});

//
// Export the selectors
//

const transientValues = createSelector(
    [
        Nodes.focusedNodePathSelector,
        $get('ui.inspector.valuesByNodePath')
    ],
    (focusedNodeContextPath, valuesByNodePath) => $get([focusedNodeContextPath], valuesByNodePath)
);





/*
    Will create a configuration for the Inspector Component to render itself
    with the following shape:

    {
        "tabs": [
            {
                "id": "my-tab-1",
                "icon": "icon-cog",
                "groups": [
                    {
                        "id": "my-group-1",
                        "label": "MyGroup 1",
                        "properties": {
                            "id": "my-property-1",
                            "label": "MyProperty 1",
                            "editor": "MyAwesome.Package:MyEditor"
                        }
                    }
                ]
            }
        ]
    }
*/
const toJS = val => val && val.toJS ? val.toJS() : val;
const withId = mapObjIndexed((subject, id) => ({
    ...subject,
    id
}));
const getPosition = subject => subject.ui ? subject.ui.position : subject.position;
const positionalArraySorter = sort((a, b) => (getPosition(a) - getPosition(b)) || (a.id - b.id));
const getNormalizedDeepStructureFromNode = path => compose(
    positionalArraySorter,
    values,
    withId,
    toJS,
    $get(path)
);

const getTabs = getNormalizedDeepStructureFromNode('nodeType.ui.inspector.tabs');
const getGroups = getNormalizedDeepStructureFromNode('nodeType.ui.inspector.groups');
const getProperties = getNormalizedDeepStructureFromNode('nodeType.properties');



const viewConfiguration = createSelector(
    [
        Nodes.focusedSelector
    ],
    (node) => {
        if (!node) {
            return undefined;
        }
        const tabs = getTabs(node);
        const groups = getGroups(node);
        const properties = getProperties(node);

        return {
            tabs: map(
                tab => ({
                    ...tab,
                    groups: map(
                        group => ({
                            ...group,
                            properties: map(
                                $transform({
                                    id: $get('id'),
                                    label: $get('ui.label'),
                                    editor: $get('ui.inspector.editor'),
                                    editorOptions: $get('ui.inspector.editorOptions')
                                }),
                                properties.filter(p => $get('ui.inspector.group', p) === group.id)
                            )
                        }),
                        groups.filter(g => {
                            const isMatch = g.tab === tab.id;
                            const isDefaultTab = !g.tab && tab.id === 'default';

                            return isMatch || isDefaultTab;
                        })
                    )
                }),
                tabs
            )
        };
    }
);

export const selectors = {
    transientValues,
    viewConfiguration
};
