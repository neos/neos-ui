import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import TestBackend from 'react-dnd-test-backend';
import {DndProvider as DragDropContextProvider} from 'react-dnd';
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

const optionValuesWithPreview = {
    foo: {
        label: 'fooLabel',
        preview: 'foo.png'
    },
    bar: {
        label: 'barLabel',
        preview: 'bar.png'
    }
};

const dropdownElementLabels = component =>
    component.find('SelectBox_ListPreview').find('ListPreviewElement').map(node => node.text());

const dropdownElementPreviews = component =>
    component.find('SelectBox_ListPreview').find('ListPreviewElement').find('img').map(node => node.prop('src'));

const dropdownHeader = component =>
    component.find('ShallowDropDownHeader');

const multiselectLabels = component =>
    component.find('MultiSelectBox_ListPreviewSortable').find('ListPreviewElement').map(node => node.text());

const commit = () => {};

test(`SelectBox > single, no dataSource, no preselected value`, () => {
    const expectedDropdownElementLabels = ['fooLabel', 'barLabel'];
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <SelectBoxEditor commit={commit} options={{values: optionValues}}/>
        </WrapWithMockGlobalRegistry>
    );

    expect(dropdownHeader(component).text()).toBe('');
    dropdownHeader(component).simulate('click');
    expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
});

test(`SelectBox > single, no dataSource, preselected value`, () => {
    const expectedDropdownElementLabels = ['fooLabel', 'barLabel'];
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <SelectBoxEditor commit={commit} options={{values: optionValues}} value="bar"/>
        </WrapWithMockGlobalRegistry>
    );

    dropdownHeader(component).simulate('click');
    expect(dropdownHeader(component).text()).toBe('barLabel');
    expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
});

test(`SelectBox > multi, no dataSource, no preselected value`, () => {
    const expectedDropdownElementLabels = ['fooLabel', 'barLabel'];
    const component = mount(
        <DragDropContextProvider backend={TestBackend}>
            <WrapWithMockGlobalRegistry>
                <SelectBoxEditor commit={commit} options={{values: optionValues, multiple: true}}/>
            </WrapWithMockGlobalRegistry>
        </DragDropContextProvider>

    );

    dropdownHeader(component).simulate('click');
    expect(multiselectLabels(component)).toEqual([]);
    expect(dropdownHeader(component).text()).toBe('');
    expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
});

test(`SelectBox > multi, no dataSource, preselected value`, () => {
    const expectedDropdownElementLabels = ['barLabel'];
    const component = mount(
        <DragDropContextProvider backend={TestBackend}>
            <WrapWithMockGlobalRegistry>
                <SelectBoxEditor commit={commit} options={{values: optionValues, multiple: true}} value={['foo']}/>
            </WrapWithMockGlobalRegistry>
        </DragDropContextProvider>

    );

    dropdownHeader(component).simulate('click');
    expect(multiselectLabels(component)).toEqual(['fooLabel']);
    expect(dropdownHeader(component).text()).toBe('');
    // Already selected values should not be in the list to choose anymore
    expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
});

/**
 * DATA SOURCES
 */
const store = createStore(state => state, {
    cr: {
        nodes: {
            focused: {
                contextPath: '/my/focused-context-path'
            }
        }
    }
});

test(`SelectBox > single, dataSource, no preselected value`, () => {
    MockDataSourceDataLoader.reset();
    const component = mount(
        <WrapWithMockGlobalRegistry>
            <Provider store={store}>
                <SelectBoxEditor commit={commit} options={{dataSourceIdentifier: 'ds1'}}/>
            </Provider>
        </WrapWithMockGlobalRegistry>
    );

    dropdownHeader(component).simulate('click');
    expect(dropdownHeader(component).text()).toBe('');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        const expectedDropdownElementLabels = ['fooLabel', 'barLabel'];
        component.update();
        expect(dropdownHeader(component).text()).toBe('');
        expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
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

    dropdownHeader(component).simulate('click');
    expect(dropdownHeader(component).text()).toBe('');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        const expectedDropdownElementLabels = ['fooLabel', 'barLabel'];
        component.update();
        expect(dropdownHeader(component).text()).toBe('barLabel');
        expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
    });
});

test(`SelectBox > single, dataSource, preview`, () => {
    MockDataSourceDataLoader.reset();
    const component = mount(
        <DragDropContextProvider backend={TestBackend}>
            <WrapWithMockGlobalRegistry>
                <Provider store={store}>
                    <SelectBoxEditor commit={commit} options={{dataSourceIdentifier: 'ds1'}}/>
                </Provider>
            </WrapWithMockGlobalRegistry>
        </DragDropContextProvider>
    );

    dropdownHeader(component).simulate('click');

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValuesWithPreview).then(() => {
        const expectedDropdownElementPreviews = ['foo.png', 'bar.png'];
        component.update();
        expect(dropdownElementPreviews(component)).toEqual(expectedDropdownElementPreviews);
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

    dropdownHeader(component).simulate('click');
    expect(multiselectLabels(component)).toEqual([]);
    expect(dropdownHeader(component).text()).toBe('');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        const expectedDropdownElementLabels = ['fooLabel', 'barLabel'];
        component.update();
        expect(multiselectLabels(component)).toEqual([]);
        expect(dropdownHeader(component).text()).toBe('');
        expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
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

    dropdownHeader(component).simulate('click');
    expect(multiselectLabels(component)).toEqual([]);
    expect(dropdownHeader(component).text()).toBe('');
    expect(dropdownElementLabels(component)).toEqual([]);

    return MockDataSourceDataLoader.resolveCurrentPromise(optionValues).then(() => {
        const expectedDropdownElementLabels = ['barLabel'];
        component.update();
        expect(multiselectLabels(component)).toEqual(['fooLabel']);
        // Already selected values should not be in the list to choose anymore
        expect(dropdownElementLabels(component)).toEqual(expectedDropdownElementLabels);
    });
});
