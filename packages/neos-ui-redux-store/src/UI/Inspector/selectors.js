import {map, mapObjIndexed, values, sort, compose} from 'ramda';
import {createSelector} from 'reselect';
import {$get, $set, $drop, $transform} from 'plow-js';

import {selectors as nodes} from '../../CR/Nodes/index';

export const transientValues = createSelector(
    [
        nodes.focusedNodePathSelector,
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

export const viewConfiguration = createSelector(
    [
        nodes.focusedSelector
    ],
    node => {
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
