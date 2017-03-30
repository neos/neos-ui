import {createShallowRenderer} from './../_lib/testUtils.js';
import SideBar from './sideBar.js';

const defaultProps = {
    position: 'left',
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(SideBar, defaultProps);

test('should render a "label" node.', () => {
    const bar = shallow();

    expect(bar.type()).toBe('div');
});
test('should add the passed "className" prop to the rendered node if passed.', () => {
    const bar = shallow({className: 'testClassName'});

    expect(bar.hasClass('testClassName')).toBeTruthy();
});
