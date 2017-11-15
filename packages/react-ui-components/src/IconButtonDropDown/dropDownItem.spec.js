import React from 'react';
import sinon from 'sinon';
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
        onClick: sinon.spy()
    };
    const tag = shallow(props);

    tag.simulate('click');

    expect(props.onClick.calledOnce).toBeTruthy();
    expect(props.onClick.args[0][0]).toBe('fooId');
});
