import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import TestBackend from 'react-dnd-test-backend';
import {DragDropContextProvider} from 'react-dnd';
import Immutable from 'immutable';

import SelectBoxEditor from './index.js';
import {WrapWithMockGlobalRegistry, MockDataSourceDataLoader} from '../../_lib/testUtils';

const optionValues = {
    foo: {
        label: 'fooLabel'
    },
    bar: {
        label: 'barLabel'
    }
};
const dropdownElementLabels = component =>
    component.find('SelectBox').find('ShallowDropDownContents').children().map(node => node.text());

const dropdownHeader = component =>
    component.find('SelectBox').find('ShallowDropDownHeader');

const multiselectLabels = component =>
    component.find('ul').first().children().map(node => node.text());

const commit = () => {};

test(`SelectBox > single, no dataSource, no preselected value`, () => {
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <SelectBoxEditor commit={commit} options={{values: optionValues}}/>
        </WrapWithMockGlobalRegistry>
    );

    expect(dropdownHeader(component).text()).toBe('');
    expect(dropdownElementLabels(component)).toEqual(['fooLabel', 'barLabel']);
});

test(`SelectBox > single, no dataSource, preselected value`, () => {
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <SelectBoxEditor commit={commit} options={{values: optionValues}} value="bar"/>
        </WrapWithMockGlobalRegistry>
    );

    expect(dropdownHeader(component).text()).toBe('barLabel');
    expect(dropdownElementLabels(component)).toEqual(['fooLabel', 'barLabel']);
});

test(`SelectBox > multi, no dataSource, no preselected value`, () => {
    const component = mount(
        <DragDropContextProvider backend={TestBackend}>
            <WrapWithMockGlobalRegistry>
                <SelectBoxEditor commit={commit} options={{values: optionValues, multiple: true}}/>
            </WrapWithMockGlobalRegistry>
        </DragDropContextProvider>

    );

    expect(multiselectLabels(component)).toEqual([]);
    expect(dropdownHeader(component).text()).toBe('');
    expect(dropdownElementLabels(component)).toEqual(['fooLabel', 'barLabel']);
});

test(`SelectBox > multi, no dataSource, preselected value`, () => {
    const component = mount(
        <DragDropContextProvider backend={TestBackend}>
            <WrapWithMockGlobalRegistry>
                <SelectBoxEditor commit={commit} options={{values: optionValues, multiple: true}} value={['foo']}/>
            </WrapWithMockGlobalRegistry>
        </DragDropContextProvider>

    );

    expect(multiselectLabels(component)).toEqual(['fooLabel']);
    expect(dropdownHeader(component).text()).toBe('');
    // already selected values should not be in the list to choose anymore
    expect(dropdownElementLabels(component)).toEqual(['barLabel']);
});

/**
 * DATA SOURCES
 */
const store = createStore(state => state, Immutable.fromJS({
    cr: {
        nodes: {
            focused: {
                contextPath: '/my/focused-context-path'
            }
        }
    }
}));

test(`SelectBox > single, dataSource, no preselected value`, () => {
    MockDataSourceDataLoader.reset();
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <Provider store={store}>
                <SelectBoxEditor commit={commit} options={{dataSourceIdentifier: 'ds1'}}/>
            </Provider>
        </WrapWithMockGlobalRegistry>
    );

    expect(dropdownHeader(component).text()).toBe('[Loading]');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        expect(dropdownHeader(component).text()).toBe('');
        expect(dropdownElementLabels(component)).toEqual(['fooLabel', 'barLabel']);
    });
});

test(`SelectBox > single, dataSource, preselected value`, () => {
    MockDataSourceDataLoader.reset();
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <Provider store={store}>
                <SelectBoxEditor commit={commit} options={{dataSourceIdentifier: 'ds1'}} value="bar"/>
            </Provider>
        </WrapWithMockGlobalRegistry>
    );

    expect(dropdownHeader(component).text()).toBe('[Loading]');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        expect(dropdownHeader(component).text()).toBe('barLabel');
        expect(dropdownElementLabels(component)).toEqual(['fooLabel', 'barLabel']);
    });
});

test(`SelectBox > multi, dataSource, no preselected value`, () => {
    MockDataSourceDataLoader.reset();
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <Provider store={store}>
                <SelectBoxEditor commit={commit} options={{dataSourceIdentifier: 'ds1', multiple: true}}/>
            </Provider>
        </WrapWithMockGlobalRegistry>
    );

    expect(multiselectLabels(component)).toEqual([]);
    expect(dropdownHeader(component).text()).toBe('[Loading]');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        expect(multiselectLabels(component)).toEqual([]);
        expect(dropdownHeader(component).text()).toBe('');
        expect(dropdownElementLabels(component)).toEqual(['fooLabel', 'barLabel']);
    });
});

test(`SelectBox > multi, dataSource, preselected value`, () => {
    MockDataSourceDataLoader.reset();
    const component = mount(
        <DragDropContextProvider backend={TestBackend}>
            <WrapWithMockGlobalRegistry>
                <Provider store={store}>
                    <SelectBoxEditor commit={commit} options={{dataSourceIdentifier: 'ds1', multiple: true}} value={['foo']}/>
                </Provider>
            </WrapWithMockGlobalRegistry>
        </DragDropContextProvider>
    );

    expect(multiselectLabels(component)).toEqual(['[Loading foo]']);
    expect(dropdownHeader(component).text()).toBe('[Loading]');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        expect(multiselectLabels(component)).toEqual(['fooLabel']);
        expect(dropdownHeader(component).text()).toBe('');
        // already selected values should not be in the list to choose anymore
        expect(dropdownElementLabels(component)).toEqual(['barLabel']);
    });
});
