import Immutable from 'immutable';
import {$all, $set, $get} from 'plow-js';

import {actions, reducer} from './index.js';

test(`PERSIST should change the affected node properties right away`, () => {
    const state = Immutable.fromJS($all(
        $set('cr.nodes.byContextPath.someContextPath', {
            properties: {
                title: 'Foo'
            }
        }),
        {}
    ));
    const action = actions.persistChanges([{
        type: 'Neos.Neos.Ui:Property',
        subject: 'someContextPath',
        payload: {
            propertyName: 'title',
            value: 'Bar'
        }
    }]);
    const nextState = reducer(state, action);

    expect($get('cr.nodes.byContextPath.someContextPath.properties.title', nextState))
        .toBe('Bar');
});

test(`PERSIST should handle multiple changes`, () => {
    const state = Immutable.fromJS($all(
        $set('cr.nodes.byContextPath.someContextPath', {
            properties: {
                title: 'Foo'
            }
        }),
        $set('cr.nodes.byContextPath.someOtherContextPath', {
            properties: {
                _hiddenInIndex: true
            }
        }),
        {}
    ));
    const action = actions.persistChanges([{
        type: 'Neos.Neos.Ui:Property',
        subject: 'someContextPath',
        payload: {
            propertyName: 'title',
            value: 'Baz'
        }
    }, {
        type: 'Neos.Neos.Ui:Property',
        subject: 'someOtherContextPath',
        payload: {
            propertyName: '_hiddenInIndex',
            value: false
        }
    }]);

    const nextState = reducer(state, action);

    expect($get('cr.nodes.byContextPath.someContextPath.properties.title', nextState))
        .toBe('Baz');
    expect($get('cr.nodes.byContextPath.someOtherContextPath.properties._hiddenInIndex', nextState))
        .toBe(false);
});

test(`PERSIST should ignore changes other than Neos.Neos.Ui:Property`, () => {
    const state = Immutable.fromJS($all(
        $set('cr.nodes.byContextPath.someContextPath', {
            properties: {
                title: 'Foo'
            }
        }),
        {}
    ));
    const action = actions.persistChanges([{
        type: 'Neos.Neos.Ui:SomeOtherChange',
        subject: 'someContextPath',
        payload: {
            propertyName: 'title',
            value: 'Bar'
        }
    }]);
    const nextState = reducer(state, action);

    expect($get('cr.nodes.byContextPath.someContextPath.properties.title', nextState))
        .toBe('Foo');
});
