import test from 'ava';
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

test('should render passed options straight away', t => {
    const props = {
        options: [{value: 'foo', label: 'bar'}]
    };

    const selectBox = shallow(props);

    t.falsy(selectBox.instance().loadOptions());
    t.is(selectBox.instance().getOptions(), props.options);
});

test('should have an initial value of \'\' (empty string)', t => {
    const selectBox = shallow();

    t.is(selectBox.instance().state.value, '');
});

test('should have the selected value', t => {
    const props = {
        options: [{value: 'foo', label: 'bar'}]
    };
    const selectBox = shallow(props);

    selectBox.instance().select(props.options[0].value);

    t.is(selectBox.instance().state.value, props.options[0].value);
});

test('should call "onSelect" when selecting a value', t => {
    const props = {
        options: [{value: 'foo', label: 'bar'}],
        onSelect: sinon.spy()
    };
    const selectBox = shallow(props);

    selectBox.instance().select(props.options[0].value);

    t.truthy(props.onSelect.calledOnce);
});

test('should render a searchbox when explicitly enabled', t => {
    const props = {
        minimumResultsForSearch: 0
    };
    const selectBox = shallow(props);

    t.truthy(selectBox.instance().isSearchEnabled());
});

test('should not render a searchbox when explicitly disabled', t => {
    const props = {
        minimumResultsForSearch: -1
    };
    const selectBox = shallow(props);

    t.falsy(selectBox.instance().isSearchEnabled());
});
