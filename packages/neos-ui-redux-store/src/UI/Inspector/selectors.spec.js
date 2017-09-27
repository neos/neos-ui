import Immutable from 'immutable';
import {$all, $set, $drop} from 'plow-js';

import {isDirty} from './selectors';

test(`Inspector is dirty when transient values are set`, () => {
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('ui.inspector.valuesByNodePath.dummyContextPath', {some: 'transientValue'}),
        {}
    );

    expect(isDirty(state)).toBe(true);

    expect(isDirty(Immutable.fromJS(state))).toBe(true);
});

test(`Inspector is not dirty when no transient values are set`, () => {
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('ui.inspector.valuesByNodePath.dummyContextPath', {}),
        {}
    );

    expect(isDirty(state)).toBe(false);
    expect(isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', null, state))).toBe(false);
    expect(isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', undefined, state))).toBe(false);

    expect(isDirty(Immutable.fromJS(state))).toBe(false);
    expect(isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', null, Immutable.fromJS(state)))).toBe(false);
    expect(isDirty($set('ui.inspector.valuesByNodePath.dummyContextPath', undefined, Immutable.fromJS(state)))).toBe(false);
});

test(`Inspector is not dirty when no transient values have been dropped`, () => {
    const state = $all(
        $set('cr.nodes.focused.contextPath', 'dummyContextPath'),
        $set('ui.inspector.valuesByNodePath.dummyContextPath', {some: 'transientValue'}),
        {}
    );

    expect(isDirty($drop('ui.inspector.valuesByNodePath.dummyContextPath', state))).toBe(false);

    expect(isDirty($drop('ui.inspector.valuesByNodePath.dummyContextPath', Immutable.fromJS(state)))).toBe(false);
});
