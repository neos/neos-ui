import {createShallowRenderer} from './../_lib/testUtils.js';
import GridItem from './gridItem.js';

const defaultProps = {
    theme: {},
    width: 'third',
    children: 'Foo children'
};
const shallow = createShallowRenderer(GridItem, defaultProps);

test('should render a "div" node.', () => {
    const grid = shallow();

    expect(grid.type()).toBe('div');
});
test('should add the passed "className" prop to the rendered div if passed.', () => {
    const grid = shallow({className: 'testClassName'});

    expect(grid.hasClass('testClassName')).toBeTruthy();
});
test('should render a inline style matching the passed "width" prop.', () => {
    const grid = shallow({width: 'half'});

    expect(grid.html().includes('style="width:50%"')).toBeTruthy();
});
test('should propagate the rest of the passed props to the wrapping node.', () => {
    const grid = shallow({
        id: 'fooId'
    });

    expect(grid.html().includes('id="fooId"')).toBeTruthy();
});
