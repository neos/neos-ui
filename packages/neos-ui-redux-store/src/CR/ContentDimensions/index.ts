import produce from 'immer';
import {$get} from 'plow-js';
import {mapObjIndexed} from 'ramda';
import {createSelector} from 'reselect';
import {action as createAction, ActionType} from 'typesafe-actions';
import {actionTypes as system, InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';


type DimensionValue = string;

type DimensionValues = DimensionValue[];

interface DimensionCombination {
    [propName: string]: DimensionValues;
}

type DimensionPresetName = string;

interface DimensionPresetCombination {
    [propName: string]: DimensionPresetName;
}

interface PresetConfiguration {
    name?: string;
    label: string;
    values: DimensionValues;
    uriSegment: string;
}

interface DimensionInformation {
    default: string;
    defaultPreset: string;
    label: string;
    icon: string;
    presets: {
        [propName: string]: PresetConfiguration;
    };
}

//
// Export the subreducer state shape interface
//
export interface State extends Readonly<{
    byName: {
        [propName: string]: DimensionInformation;
    };
    active: DimensionCombination | null;
    allowedPresets: {
        [propName: string]: DimensionPresetName[]
    };
}> {}

export const defaultState: State = {
    byName: {},
    active: null,
    allowedPresets: {}
};

//
// Export the action types
//
export enum actionTypes {
    SELECT_PRESET = '@neos/neos-ui/CR/ContentDimensions/SELECT_PRESET',
    SET_ACTIVE = '@neos/neos-ui/CR/ContentDimensions/SET_ACTIVE',
    SET_ALLOWED = '@neos/neos-ui/CR/ContentDimensions/SET_ALLOWED'
}

export type Action = ActionType<typeof actions>;

//
// Export the actions
//
export const actions = {
    /**
     * Selects dimension presets
     */
    selectPreset: (targetPresets: DimensionPresetCombination) => createAction(actionTypes.SELECT_PRESET, {targetPresets}),
    /**
     * Sets the currently active content dimensions
     */
    setActive: (dimensionValues: DimensionCombination) => createAction(actionTypes.SET_ACTIVE, {dimensionValues}),
    /**
     * Sets the currently allowed presets for dimension
     */
    setAllowed: (dimensionName: string, allowedPresets: DimensionPresetName[]) => createAction(actionTypes.SET_ALLOWED,  {dimensionName, allowedPresets})
};

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.byName = action.payload.cr.contentDimensions.byName;
            draft.active = action.payload.cr.contentDimensions.active;
            draft.allowedPresets = action.payload.cr.contentDimensions.allowedPresets;
            break;
        }
        case actionTypes.SELECT_PRESET: {
            const targetPresets = action.payload.targetPresets;
            Object.keys(targetPresets).forEach(dimensionName => {
                const presetName = targetPresets[dimensionName];
                const dimensionValues = state.byName[dimensionName].presets[presetName].values;
                if (draft.active !== null) {
                    draft.active[dimensionName] = dimensionValues;
                }
            });
            break;
        }
        case actionTypes.SET_ACTIVE: {
            const dimensionValues = action.payload.dimensionValues;
            const previousActive = state.active;
            if (previousActive !== null) {
                Object.keys(previousActive).forEach(dimensionName => {
                    if (draft.active !== null) {
                        draft.active[dimensionName] = dimensionValues[dimensionName];
                    }
                });
            }
            break;
        }
        case actionTypes.SET_ALLOWED: {
            const {dimensionName, allowedPresets} = action.payload;
            draft.allowedPresets[dimensionName] = allowedPresets;
            break;
        }
    }
});

/**
 * Get the currently active dimension values by dimension name
 *
 * Structure:
 *
 *   {
 *     language: ["fr"],
 *     country: ["fr"]
 *   }
 */
const activeSelector = (state: GlobalState) => $get(['cr', 'contentDimensions', 'active'], state);

/**
 * Get the allowed presets for the currently active dimension values by dimension name
 *
 * Structure:
 *
 *   {
 *     language: ["en_US", "en_UK", "de", "fr", ...]
 *   }
 */
const allowedPresetsSelector = (state: GlobalState) => $get(['cr', 'contentDimensions', 'allowedPresets'], state);

/**
 * Get dimension configurations by dimension name
 *
 * Structure:
 *
 *   {
 *     language: {
 *       label: "Language",
 *       icon: "fa-language",
 *       default: "en_US",
 *       defaultPreset: "en_US",
 *       presets: {
 *         en_US: {
 *           label: "English (US)",
 *           values: ["en_US"],
 *           uriSegment: "en"
 *         },
 *         ...
 *       }
 *     }
 *   }
 */
const byNameSelector = (state: GlobalState) => $get(['cr', 'contentDimensions', 'byName'], state);

/**
 * Get the currently active dimension presets by dimension name
 *
 * Structure:
 *
 *   {
 *     language: {
 *       name: "da",
 *       label: "Danish",
 *       values: ["da"]
 *     }
 *   }
 */
const activePresetsSelector = createSelector([
    activeSelector,
    byNameSelector
], (active, byName) => {
    // TODO We might want to use the selected preset values (pass from host frame or content canvas) instead of individual dimension values
    if (active !== null) {
        return mapObjIndexed((dimensionValues, name) => {
            const dimensionConfiguration = byName[name];
            const presets = dimensionConfiguration.presets;
            const activePreset = Object.keys(presets).find(dimensionName => presets[dimensionName].values === dimensionValues);
            const presetName = activePreset || dimensionConfiguration.defaultPreset;
            const finalActivePreset = presets[presetName];
            return Object.assign({}, finalActivePreset, {name: presetName});
        }, active);
    }
    return {};
});

//
// Export the selectors
//
export const selectors = {
    active: activeSelector,
    byName: byNameSelector,
    allowedPresets: allowedPresetsSelector,
    activePresets: activePresetsSelector
};
