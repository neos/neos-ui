import sinon from 'sinon';
import {createShallowRenderer, createStubComponent} from './../_lib/testUtils.js';
import SelectBox from './selectBox.js';

const DropDownComponent = createStubComponent();
DropDownComponent.Header = createStubComponent();
DropDownComponent.Contents = createStubComponent();

const defaultProps = {
    options: [],
    onSelect: () => null,
    theme: {},
    DropDownComponent,
    IconComponent: createStubComponent(),
    InputComponent: createStubComponent()
};

const shallow = createShallowRenderer(SelectBox, defaultProps);

test('should render passed options straight away', () => {
    const props = {
        options: [{value: 'foo', label: 'bar'}]
    };

    const selectBox = shallow(props);

    expect(selectBox.instance().loadOptions()).toBeFalsy();
    expect(selectBox.instance().getOptions()).toBe(props.options);
});

test('should have an initial value of \'\' (empty string)', () => {
    const selectBox = shallow();

    expect(selectBox.instance().state.value).toBe('');
});

test('should have the selected value', () => {
    const props = {
        options: [{value: 'foo', label: 'bar'}]
    };
    const selectBox = shallow(props);

    selectBox.instance().select(props.options[0].value);

    expect(selectBox.instance().state.value).toBe(props.options[0].value);
});

test('should call "onSelect" when selecting a value', () => {
    const props = {
        options: [{value: 'foo', label: 'bar'}],
        onSelect: sinon.spy()
    };
    const selectBox = shallow(props);

    selectBox.instance().select(props.options[0].value);

    expect(props.onSelect.calledOnce).toBeTruthy();
});

test('should not call "onSelect" on initial render when having a value set', () => {
    const props = {
        options: [{value: 'foo', label: 'bar'}],
        value: 'some value',
        onSelect: sinon.spy()
    };
    const selectBox = shallow(props);

    selectBox.instance().componentDidMount();

    expect(props.onSelect.notCalled).toBeTruthy();
});

test('should render a searchbox when explicitly enabled', () => {
    const props = {
        minimumResultsForSearch: 0
    };
    const selectBox = shallow(props);

    expect(selectBox.instance().isSearchEnabled()).toBeTruthy();
});

test('should not render a searchbox when explicitly disabled', () => {
    const props = {
        minimumResultsForSearch: -1
    };
    const selectBox = shallow(props);

    expect(selectBox.instance().isSearchEnabled()).toBeFalsy();
});

test('should render a delete icon if a `onDelete` prop was passed', () => {
    const props = {
        minimumResultsForSearch: -1,
        onDelete: sinon.spy()
    };
    const selectBox = shallow(props);
    const deleteAnchor = selectBox.find(DropDownComponent.Header).find('a');

    expect(deleteAnchor.length).toBe(1);
    expect(deleteAnchor.find(defaultProps.IconComponent).length).toBe(1);
    expect(deleteAnchor.find(defaultProps.IconComponent).prop('icon')).toBe('close');

    deleteAnchor.simulate('click', {
        preventDefault: () => null,
        stopPropagation: () => null
    });

    expect(props.onDelete.callCount).toBe(1);
});
