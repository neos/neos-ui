import {createAction} from 'redux-actions';
import {List, Map} from 'immutable';
import {$set, $get, $all} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';
import {createSelector} from 'reselect';
import {fromJSOrdered} from '@neos-project/utils-helpers';

const SELECT_PRESET = '@neos/neos-ui/CR/ContentDimensions/SELECT_PRESET';
const SET_ACTIVE = '@neos/neos-ui/CR/ContentDimensions/SET_ACTIVE';
const SET_ALLOWED = '@neos/neos-ui/CR/ContentDimensions/SET_ALLOWED';

export const actionTypes = {
    SELECT_PRESET,
    SET_ACTIVE,
    SET_ALLOWED
};

/**
 * Selects dimension presets
 */
const selectPreset = createAction(SELECT_PRESET, targetPresets => ({targetPresets}));

/**
 * Sets the currently active content dimensions
 */
const setActive = createAction(SET_ACTIVE, dimensionValues => ({dimensionValues}));

/**
 * Sets the currently allowed presets for dimension
 */
const setAllowed = createAction(SET_ALLOWED, (dimensionName, allowedPresets) => ({dimensionName, allowedPresets}));

//
// Export the actions
//
export const actions = {
    selectPreset,
    setActive,
    setAllowed
};

/**
 * Get the currently active dimension values by dimension name
 *
 * Structure:
 *
 *   {
 *     language: ["fr"]
 *   }
 */
const active = $get('cr.contentDimensions.active');

/**
 * Get the allowed presets for the currently active dimension values by dimension name
 *
 * Structure:
 *
 *   {
 *     language: ["en_US", "en_UK", "de", "fr", ...]
 *   }
 */
const allowedPresets = $get('cr.contentDimensions.allowedPresets');

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
const byName = $get('cr.contentDimensions.byName');

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'cr.contentDimensions',
        new Map({
            byName: fromJSOrdered(byName(state)),
            active: fromJSOrdered(active(state)),
            allowedPresets: fromJSOrdered(allowedPresets(state))
        })
    ),
    [SELECT_PRESET]: ({targetPresets}) => state => $all(...Object.keys(targetPresets).map(dimensionName => {
        const presetName = targetPresets[dimensionName];
        const dimensionValues = $get(['cr', 'contentDimensions', 'byName', dimensionName, 'presets', presetName, 'values'], state);
        return $set(['cr', 'contentDimensions', 'active', dimensionName], dimensionValues);
    }), state),
    [SET_ACTIVE]: ({dimensionValues}) => state => {
        const previousActive = active(state);
        const newActive = previousActive.toSeq().map((values, dimensionName) => new List(dimensionValues[dimensionName])).toMap();
        return $set('cr.contentDimensions.active', newActive, state);
    },
    [SET_ALLOWED]: ({dimensionName, allowedPresets}) => $set(['cr', 'contentDimensions', 'allowedPresets', dimensionName], fromJSOrdered(allowedPresets))
});

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
const activePresets = createSelector([
    active,
    byName
], (active, byName) => {
    // TODO We might want to use the selected preset values (pass from host frame or content canvas) instead of individual dimension values
    return active.map((dimensionValues, name) => {
        const dimensionConfiguration = $get(name, byName);
        const presets = $get('presets', dimensionConfiguration);
        const activePreset = presets.findKey(preset => preset.get('values').equals(dimensionValues));
        const presetName = activePreset || $get('defaultPreset', dimensionConfiguration);
        return presets.get(presetName).set('name', presetName);
    });
});

//
// Export the selectors
//
export const selectors = {
    active,
    activePresets,
    allowedPresets,
    byName
};
