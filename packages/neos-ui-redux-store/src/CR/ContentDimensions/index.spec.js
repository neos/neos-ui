import Immutable from 'immutable';
import {$all, $set, $get} from 'plow-js';

import {actionTypes, actions, reducer, selectors} from './index.js';
import {actionTypes as system} from '../../System/index';

const fixtures = {};

fixtures.dimensionState = $all(
    $set('cr.contentDimensions.active', {language: ['fr']}),
    $set('cr.contentDimensions.allowedPresets', {
        language: ['en_US', 'en_UK', 'de', 'fr']
    }),
    $set('cr.contentDimensions.byName', {
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

test(`The reducer should create a valid initial state`, () => {
    const state = new Immutable.Map({});
    const nextState = reducer(state, {
        type: system.INIT,
        payload: fixtures.dimensionState
    });

    expect(nextState).toMatchSnapshot();
});

test(`SELECT_PRESET should add the selected preset's dimension values to the active state`, () => {
    const state = Immutable.fromJS(fixtures.dimensionState);
    const action = actions.selectPreset('topicfocus', 'sports');
    const nextState = reducer(state, action);

    expect(nextState).toMatchSnapshot();
});

test(`SELECT_PRESET should overwrite the currently selected dimension values`, () => {
    const state = Immutable.fromJS(fixtures.dimensionState);
    const action = actions.selectPreset('language', 'en_UK');
    const nextState = reducer(state, action);

    expect(nextState).toMatchSnapshot();
});

test(`SET_ACTIVE should overwrite the currently selected dimension values`, () => {
    const state = Immutable.fromJS(fixtures.dimensionState);
    const action = actions.setActive({
        language: ['en_UK']
    });
    const nextState = reducer(state, action);

    expect(nextState).toMatchSnapshot();
});

test(`SET_ACTIVE should ignore dimensions that haven't been previously active`, () => {
    const state = Immutable.fromJS(fixtures.dimensionState);
    const action = actions.setActive({
        language: ['en_UK'],
        topicfocus: ['sports']
    });
    const nextState = reducer(state, action);

    expect(nextState).toMatchSnapshot();
});

test(`allowedPresets selector should return the allowed Presets`, () => {
    const state = Immutable.fromJS(fixtures.dimensionState);
    const allowedPresets = selectors.allowedPresets(state);

    expect(allowedPresets).toMatchSnapshot();
});

test(`active selector should return the active dimension values`, () => {
    const state = Immutable.fromJS(fixtures.dimensionState);
    const active = selectors.active(state);

    expect(active).toMatchSnapshot();
});

test(`activePresets selector should return the active dimensions configuration`, () => {
    const state = Immutable.fromJS(fixtures.dimensionState);
    const activePresets = selectors.activePresets(state);

    expect(activePresets).toMatchSnapshot();
});

test(`activePresets selector should fall back to default preset, if none is set`, () => {
    const state = Immutable.fromJS(
        $set('cr.contentDimensions.active.language', null, fixtures.dimensionState)
    );
    const activePresets = selectors.activePresets(state);

    expect($get('language.name', activePresets)).toBe('en_US');
});
