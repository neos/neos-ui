import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $head, $get} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';
import {createSelector} from 'reselect';

const SELECT_PRESET = '@neos/neos-ui/CR/ContentDimensions/SELECT_PRESET';

export const actionTypes = {
    SELECT_PRESET
};

/**
 * Selects a preset for the given content dimension
 */
const selectPreset = createAction(SELECT_PRESET, (name, presetName) => ({name, presetName}));

//
// Export the actions
//
export const actions = {
    selectPreset
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'cr.contentDimensions',
        new Map({
            byName: Immutable.fromJS($get('cr.contentDimensions.byName', state)),
            active: Immutable.fromJS($get('cr.contentDimensions.active', state))
        })
    ),
    [SELECT_PRESET]: ({name, presetName}) => state => {
        const dimensionValues = Immutable.fromJS($get(['cr', 'contentDimensions', 'byName', name, 'presets', presetName, 'values'], state));
        return $set(['cr', 'contentDimensions', 'active', name], dimensionValues, state);
    }
});

const active = $get('cr.contentDimensions.active');
const byName = $get('cr.contentDimensions.byName');

const activePresets = createSelector([
    active,
    byName
], (active, byName) => {
    return active.map((dimensionValues, name) => {
        const dimensionConfiguration = byName.get(name);
        const presets = dimensionConfiguration.get('presets');
        const activePreset = presets.findKey(preset => preset.get('values').equals(dimensionValues));
        const presetName = activePreset || dimensionConfiguration.get('defaultPreset');
        return presets.get(presetName).set('name', presetName);
    });
});

//
// Export the selectors
//
export const selectors = {
    activePresets
};
