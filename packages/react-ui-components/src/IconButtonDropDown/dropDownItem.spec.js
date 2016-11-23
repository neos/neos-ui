import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import DropDownItem from './dropDownItem.js';

const defaultProps = {
    onClick: () => null,
    id: 'fooId',
    children: 'Foo children'
};
const shallow = createShallowRenderer(DropDownItem, defaultProps);

test('should render a "a" node with an role="button" attribute.', t => {
    const tag = shallow();

    t.is(tag.type(), 'a');
    t.truthy(tag.html().includes('role="button"'));
});
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const btn = shallow({
        'data-baz': 'bar'
    });

    t.truthy(btn.html().includes('data-baz="bar"'));
});
test('should render the children.', t => {
    const btn = shallow();

    t.truthy(btn.html().includes('Foo children'));
});
test('should call the "onClick" prop with the passed "id" when clicking on the anchor.', t => {
    const props = {
        onClick: sinon.spy()
    };
    const tag = shallow(props);

    tag.simulate('click');

    t.truthy(props.onClick.calledOnce);
    t.is(props.onClick.args[0][0], 'fooId');
});
