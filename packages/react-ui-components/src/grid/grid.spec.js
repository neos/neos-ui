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

    t.is(grid.type(), 'div');
});
test('should add the passed "className" prop to the rendered div if passed.', t => {
    const grid = shallow({className: 'testClassName'});

    t.truthy(grid.hasClass('testClassName'));
});
test('should propagate the rest of the passed props to the wrapping node.', t => {
    const grid = shallow({
        id: 'fooId'
    });

    t.truthy(grid.html().includes('id="fooId"'));
});
