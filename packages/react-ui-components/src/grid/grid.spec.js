import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Grid from './grid.js';

const defaultProps = {
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(Grid, defaultProps);

test('should initially have a falsy "isOpen" state value.', t => {
    const grid = shallow();

    t.truthy(grid.type() === 'div');
});
test('should add the passed "className" prop to the rendered div if passed.', t => {
    const grid = shallow({className: 'testClassName'});

    t.truthy(grid.hasClass('testClassName'));
});
