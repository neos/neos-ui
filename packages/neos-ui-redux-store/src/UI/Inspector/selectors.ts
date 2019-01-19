import {createSelector, defaultMemoize} from 'reselect';
import {$get} from 'plow-js';
import validate from '@neos-project/neos-ui-validators';
import {selectors as nodes} from '@neos-project/neos-ui-redux-store/src/CR/Nodes';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeTypesRegistry, ValidatorRegistry} from '@neos-project/neos-ts-interfaces';

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
        (state: GlobalState) => $get(['ui', 'inspector', 'valuesByNodePath'], state)
    ],
    (focusedNodeContextPath, valuesByNodePath) => focusedNodeContextPath ? valuesByNodePath[focusedNodeContextPath] : {}
);

export const isDirty = createSelector(
    [
        transientValues
    ],
    transientValues => Boolean(transientValues && (Object.keys(transientValues).length > 0))
);

export const shouldPromptToHandleUnappliedChanges = (state: GlobalState) => $get(['ui', 'inspector', 'shouldPromptToHandleUnappliedChanges'], state);

export const shouldShowSecondaryInspector = (state: GlobalState) => $get(['ui', 'inspector', 'secondaryInspectorIsOpen'], state);

const propertiesForValidationSelector = createSelector(
    [

        transientValues,
        nodes.focusedSelector
    ],
    (
        transientValues,
        focusedNode
    ) => {
        const propertiesForValidation = Object.assign({}, focusedNode ? focusedNode.properties : {});
        if (transientValues) {
            // Override values with transient values
            Object.keys(transientValues).forEach(key => {
                if (transientValues[key] !== undefined) { // dummy type guard
                    propertiesForValidation[key] = transientValues[key].value;
                }
            });
        }
        return propertiesForValidation;
    }
);

// Here, we use "defaultMemoize()", as validation errors are quasi-singletons; so we want all instances of the selector
// to be shared for all fields. If we did not do this, the system would recompute the validation for each form field (which
// is way too often.)
// TODO: type validatorRegistry
export const makeValidationErrorsSelector = defaultMemoize((nodeTypesRegistry: NodeTypesRegistry, validatorRegistry: any) => createSelector(
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
        const nodeType = nodeTypesRegistry.get(focusedNode.nodeType);
        if (!nodeType) {
            console.error(`Nodetype ${nodeType} not found`); // tslint:disable-line no-console
            return null;
        }
        if (!nodeType.properties) {
            console.error(`No properties configured in ${nodeType} nodetype`); // tslint:disable-line no-console
            return null;
        }

        const validationErrors = validate(propertiesForValidation, nodeType.properties, validatorRegistry);

        return validationErrors;
    }
));

export const makeIsApplyDisabledSelector = (nodeTypesRegistry: NodeTypesRegistry, validatorRegistry: ValidatorRegistry) => createSelector(
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
