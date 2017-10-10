import {map, mapObjIndexed, values, sort, compose} from 'ramda';
import {createSelector, defaultMemoize} from 'reselect';
import {$get, $count, $transform} from 'plow-js';
import validate from '@neos-project/neos-ui-validators/src/index';
import {selectors as nodes} from '../../CR/Nodes/index';

/**
 * Transient values and everything which depends on this
 *
 * - transientValues
 * - propertiesForValidation (merges transientValues + selectors.CR.Nodes.focusedSelector)
 * - makeValidationErrorsSelector (contains the full validation errors)
 */
export const transientValues = createSelector(
    [
        nodes.focusedNodePathSelector,
        $get('ui.inspector.valuesByNodePath')
    ],
    (focusedNodeContextPath, valuesByNodePath) => $get([focusedNodeContextPath], valuesByNodePath)
);

export const isDirty = createSelector(
    [
        transientValues
    ],
    transientValues => Boolean(transientValues && ($count('transientValues', {transientValues}) > 0))
);

export const shouldPromptToHandleUnappliedChanges = $get('ui.inspector.shouldPromptToHandleUnappliedChanges');

export const shouldShowSecondaryInspector = $get('ui.inspector.secondaryInspectorIsOpen');

const propertiesForValidationSelector = createSelector(
    [

        transientValues,
        nodes.focusedSelector
    ],
    (
        transientValues,
        focusedNode
    ) => {
        const propertiesForValidation = Object.assign({}, $get('properties', focusedNode));
        if (transientValues) {
            // Override values with transient values
            Object.keys(transientValues.toJS()).forEach(key => {
                propertiesForValidation[key] = $get([key, 'value'], transientValues);
            });
        }
        return propertiesForValidation;
    }
);

// here, we use "defaultMemoize()", as validation errors are quasi-singletons; so we want all instances of the selector
// to be shared for all fields. If we did not do this, the system would recompute the validation for each form field (which
// is way too often.)
export const makeValidationErrorsSelector = defaultMemoize((nodeTypesRegistry, validatorRegistry) => createSelector(
    [
        propertiesForValidationSelector,
        nodes.focusedSelector
    ],
    (
        propertiesForValidation,
        focusedNode
    ) => {
        if (!focusedNode) {
            return false;
        }

        const nodeType = nodeTypesRegistry.get($get('nodeType', focusedNode));
        if (!$get('properties', nodeType)) {
            console.error(`No properties configured in ${$get('nodeType', focusedNode)} nodetype`);
            return null;
        }

        const validationErrors = validate(propertiesForValidation, $get('properties', nodeType), validatorRegistry);

        return validationErrors;
    }
));

export const makeIsApplyDisabledSelector = (nodeTypesRegistry, validatorRegistry) => createSelector(
    [
        isDirty,
        makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry)
    ],
    (
        isDirty,
        validationErrors
    ) => {
        return !isDirty || (isDirty && validationErrors !== null);
    }
);

export const isDiscardDisabledSelector = createSelector(
    [
        isDirty
    ],
    isDirty => !isDirty
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
