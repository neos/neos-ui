import {$all, $set, $get} from 'plow-js';

import {actionTypes, actions, reducer, selectors, defaultState} from './index';
import {actionTypes as system} from '../../System/index';

const fixtures = {};

fixtures.dimensionState = $all(
    $set('active', {language: ['fr']}),
    $set('allowedPresets', {
        language: ['en_US', 'en_UK', 'de', 'fr']
    }),
    $set('byName', {
        language: {
            label: 'Language',
            icon: 'fa-language',
            default: 'en_US',
            defaultPreset: 'en_US',
            presets: {
                en_US: { // eslint-disable-line
                    label: 'English (US)',
                    values: ['en_US'],
                    uriSegment: 'en'
                },
                en_UK: { // eslint-disable-line
                    label: 'English (UK)',
                    values: ['en_UK'],
                    uriSegment: 'en-uk'
                },
                de: {
                    label: 'German',
                    values: ['de'],
                    uriSegment: 'de'
                },
                fr: {
                    label: 'French',
                    values: ['fr'],
                    uriSegment: 'fr'
                }
            }
        },
        topicfocus: {
            label: 'Topic focus',
            icon: 'fa-user',
            default: 'all',
            defaultPreset: 'all',
            presets: {
                all: {
                    label: 'All',
                    values: ['all'],
                    uriSegment: 'all'
                },
                family: {
                    label: 'Family',
                    values: ['family'],
                    uriSegment: 'family'
                },
                sports: {
                    label: 'Sports',
                    values: ['sports'],
                    uriSegment: 'sports'
                },
                adventure: {
                    label: 'Adventure',
                    values: ['adventure'],
                    uriSegment: 'adventure'
                }
            }
        }
    }),
    {}
);

fixtures.globalState = {
    cr: {
        contentDimensions: fixtures.dimensionState
    }
};

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.SELECT_PRESET)).toBe('string');
    expect(typeof (actionTypes.SET_ACTIVE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.selectPreset)).toBe('function');
    expect(typeof (actions.setActive)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
});

test(`The reducer should return the default state when called with undefined.`, () => {
    const nextState = reducer(undefined, {
        type: 'unknown'
    });

    expect(nextState).toBe(defaultState);
});

test(`The reducer should correctly rehydrate data on INIT.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: fixtures.globalState
    });

    expect(nextState).toEqual(fixtures.dimensionState);
});

test(`SELECT_PRESET should add the selected preset's dimension values to the active state`, () => {
    const state = fixtures.dimensionState;
    const action = actions.selectPreset({topicfocus: 'sports'});
    const nextState = reducer(state, action);

    expect(nextState.active.topicfocus).toEqual(['sports']);
});

test(`SELECT_PRESET should overwrite the currently selected dimension values`, () => {
    const state = fixtures.dimensionState;
    const action = actions.selectPreset({language: 'en_UK'});
    const nextState = reducer(state, action);

    expect(nextState.active.language).toEqual(['en_UK']);
});

test(`SET_ACTIVE should overwrite the currently selected dimension values`, () => {
    const state = fixtures.dimensionState;
    const action = actions.setActive({
        language: ['en_UK']
    });
    const nextState = reducer(state, action);

    expect(nextState.active.language).toEqual(['en_UK']);
});

test(`SET_ACTIVE should ignore dimensions that haven't been previously active`, () => {
    const state = fixtures.dimensionState;
    const action = actions.setActive({
        language: ['en_UK'],
        topicfocus: ['sports']
    });
    const nextState = reducer(state, action);

    expect(nextState.active.language).toEqual(['en_UK']);
    expect(nextState.active.topicfocus).not.toEqual(['sports']);
});

test(`allowedPresets selector should return the allowed Presets`, () => {
    const state = fixtures.globalState;
    const allowedPresets = selectors.allowedPresets(state);

    expect(allowedPresets.language).toEqual(['en_US', 'en_UK', 'de', 'fr']);
});

test(`active selector should return the active dimension values`, () => {
    const state = fixtures.globalState;
    const active = selectors.active(state);

    expect(active.language).toEqual(['fr']);
});

test(`activePresets selector should return the active dimensions configuration`, () => {
    const state = fixtures.globalState;
    const activePresets = selectors.activePresets(state);

    expect(activePresets.language.name).toBe('fr');
});

test(`activePresets selector should fall back to default preset, if none is set`, () => {
    const state = $set('cr.contentDimensions.active.language', null, fixtures.globalState);
    const activePresets = selectors.activePresets(state);

    expect($get('language.name', activePresets)).toBe('en_US');
});
