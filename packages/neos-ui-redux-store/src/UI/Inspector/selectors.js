import {createSelector, defaultMemoize} from 'reselect';
import {$get, $count} from 'plow-js';
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
