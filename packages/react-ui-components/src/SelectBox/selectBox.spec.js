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
