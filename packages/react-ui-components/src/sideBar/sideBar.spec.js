import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import SideBar from './sideBar.js';

const defaultProps = {
    position: 'left',
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(SideBar, defaultProps);

test('should render a "label" node.', t => {
    const bar = shallow();

    t.truthy(bar.type() === 'div');
});
test('should add the passed "className" prop to the rendered node if passed.', t => {
    const bar = shallow({className: 'testClassName'});

    t.truthy(bar.hasClass('testClassName'));
});
