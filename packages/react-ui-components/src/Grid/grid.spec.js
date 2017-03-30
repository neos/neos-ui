import {createShallowRenderer} from './../_lib/testUtils.js';
import Grid from './grid.js';

const defaultProps = {
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(Grid, defaultProps);

test('should initially have a falsy "isOpen" state value.', () => {
    const grid = shallow();

    expect(grid.type()).toBe('div');
});
test('should add the passed "className" prop to the rendered div if passed.', () => {
    const grid = shallow({className: 'testClassName'});

    expect(grid.hasClass('testClassName')).toBeTruthy();
});
test('should propagate the rest of the passed props to the wrapping node.', () => {
    const grid = shallow({
        id: 'fooId'
    });

    expect(grid.html().includes('id="fooId"')).toBeTruthy();
});
