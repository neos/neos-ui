import Immutable from 'immutable';
import {$all, $set, $drop} from 'plow-js';

import * as selectors from './selectors';

test(`transientValues should return the transient inspector values for the currently focused node`, () => {
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('ui.inspector.valuesByNodePath.dummyContextPath', {some: 'transientValue'}),
        {}
    );

    expect(selectors.transientValues(state)).toEqual({
        some: 'transientValue'
    });
});

test(`Inspector is dirty when transient values are set`, () => {
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('ui.inspector.valuesByNodePath.dummyContextPath', {some: 'transientValue'}),
        {}
    );

    expect(selectors.isDirty(state)).toBe(true);

    expect(selectors.isDirty(Immutable.fromJS(state))).toBe(true);
});

test(`Inspector is not dirty when no transient values are set`, () => {
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('ui.inspector.valuesByNodePath.dummyContextPath', {}),
        {}
    );

    expect(selectors.isDirty(state)).toBe(false);
    expect(selectors.isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', null, state))).toBe(false);
    expect(selectors.isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', undefined, state))).toBe(false);

    expect(selectors.isDirty(Immutable.fromJS(state))).toBe(false);
    expect(selectors.isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', null, Immutable.fromJS(state)))).toBe(false);
    expect(selectors.isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', undefined, Immutable.fromJS(state)))).toBe(false);
});

test(`Inspector is not dirty when no transient values have been dropped`, () => {
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('ui.inspector.valuesByNodePath.dummyContextPath', {some: 'transientValue'}),
        {}
    );

    expect(selectors.isDirty($drop('ui.inspector.valuesByNodePath.dummyContextPath', state))).toBe(false);

    expect(selectors.isDirty($drop('ui.inspector.valuesByNodePath.dummyContextPath', Immutable.fromJS(state)))).toBe(false);
});

test(`validationErrorsSelector should return null, when there's no validator configuration`, () => {
    const nodeTypesRegistry = {
        get: () => ({
            properties: {}
        })
    };
    const validatorRegistry = {
        get: () => () => null
    };
    const validationErrorsSelector = selectors.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('cr.nodes.byContextPath.dummyContextPath.properties', {
            title: 'Foo'
        }),
        {}
    );

    expect(validationErrorsSelector(state)).toEqual(null);
});

test(`validationErrorsSelector should read the nodeType configuration for the currently focused node`, () => {
    const nodeTypesRegistry = {
        get: jest.fn()
    };
    const validatorRegistry = {
        get: () => () => null
    };

    const validationErrorsSelector = selectors.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('cr.nodes.byContextPath.dummyContextPath.nodeType', 'DummyNodeType'),
        {}
    );

    validationErrorsSelector(state);

    expect(nodeTypesRegistry.get).toBeCalledWith('DummyNodeType');
});

test(`validationErrorsSelector should return validationErrors, when there are invalid field`, () => {
    const nodeTypesRegistry = {
        get: () => $all(
            $set('properties.title.validation.required', {}),
            $set('properties.label.validation.required', {}),
            {}
        )
    };
    const validatorRegistry = {
        get: () => () => 'ValidationError'
    };
    const validationErrorsSelector = selectors.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('cr.nodes.byContextPath.dummyContextPath.properties', {
            title: '',
            label: ''
        }),
        {}
    );

    expect(validationErrorsSelector(state)).toEqual({
        title: ['ValidationError'],
        label: ['ValidationError']
    });
});
