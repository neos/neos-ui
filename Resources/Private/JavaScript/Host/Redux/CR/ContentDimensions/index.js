import {createAction} from 'redux-actions';
import Immutable, {List, Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';
import {createSelector} from 'reselect';

const SELECT_PRESET = '@neos/neos-ui/CR/ContentDimensions/SELECT_PRESET';
const SET_ACTIVE = '@neos/neos-ui/CR/ContentDimensions/SET_ACTIVE';

export const actionTypes = {
    SELECT_PRESET,
    SET_ACTIVE
};

/**
 * Selects a preset for the given content dimension
 */
const selectPreset = createAction(SELECT_PRESET, (name, presetName) => ({name, presetName}));

/**
 * Sets the currently active content dimensions
 */
const setActive = createAction(SET_ACTIVE, dimensionValues => ({dimensionValues}));

//
// Export the actions
//
export const actions = {
    selectPreset,
    setActive
};

const active = $get('cr.contentDimensions.active');
const byName = $get('cr.contentDimensions.byName');
const allowedPresets = $get('cr.contentDimensions.allowedPresets');

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'cr.contentDimensions',
        new Map({
            byName: Immutable.fromJS(byName(state)),
            active: Immutable.fromJS(active(state)),
            allowedPresets: Immutable.fromJS(allowedPresets(state))
        })
    ),
    [SELECT_PRESET]: ({name, presetName}) => state => {
        const dimensionValues = $get(['cr', 'contentDimensions', 'byName', name, 'presets', presetName, 'values'], state);
        return $set(['cr', 'contentDimensions', 'active', name], dimensionValues, state);
    },
    [SET_ACTIVE]: ({dimensionValues}) => state => {
        const previousActive = active(state);
        const newActive = previousActive.toSeq().map((values, dimensionName) => new List(dimensionValues[dimensionName])).toMap();
        return $set('cr.contentDimensions.active', newActive, state);
    }
});

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
    activePresets
};
