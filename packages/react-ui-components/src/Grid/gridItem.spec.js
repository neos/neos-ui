import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import GridItem from './gridItem.js';

const defaultProps = {
    theme: {},
    width: 'third'
};
const shallow = createShallowRenderer(GridItem, defaultProps);

test('should render a "div" node.', t => {
    const grid = shallow();

    t.is(grid.type(), 'div');
});
test('should add the passed "className" prop to the rendered div if passed.', t => {
    const grid = shallow({className: 'testClassName'});

    t.truthy(grid.hasClass('testClassName'));
});
test('should render a inline style matching the passed "width" prop.', t => {
    const grid = shallow({width: 'half'});

    t.truthy(grid.html().includes('style="width:50%;"'));
});
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const grid = shallow({
        id: 'fooId'
    });

    t.truthy(grid.html().includes('id="fooId"'));
});
