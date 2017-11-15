import React from 'react';
import {createShallowRenderer} from './../_lib/testUtils.js';
import DropDownItem from './dropDownItem.js';

const defaultProps = {
    onClick: () => null,
    id: 'fooId',
    children: <div>Foo children</div>
};
const shallow = createShallowRenderer(DropDownItem, defaultProps);

test('should render a "a" node with an role="button" attribute.', () => {
    const tag = shallow();

    expect(tag.type()).toBe('a');
    expect(tag.html().includes('role="button"')).toBeTruthy();
});
test('should propagate the rest of the passed props to the wrapping node.', () => {
    const btn = shallow({
        'data-baz': 'bar'
    });

    expect(btn.html().includes('data-baz="bar"')).toBeTruthy();
});
test('should render the children.', () => {
    const btn = shallow();

    expect(btn.html().includes('Foo children')).toBeTruthy();
});
test('should call the "onClick" prop with the passed "id" when clicking on the anchor.', () => {
    const props = {
        onClick: jest.fn()
    };
    const tag = shallow(props);

    tag.simulate('click');

    expect(props.onClick.mock.calls.length).toBe(1);
    expect(props.onClick.mock.calls[0][0]).toBe('fooId');
});
