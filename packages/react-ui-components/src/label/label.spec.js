import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Label from './label.js';

const defaultProps = {
    theme: {},
    htmlFor: 'test for'
};
const shallow = createShallowRenderer(Label, defaultProps);

test('should render a "label" node.', t => {
    const label = shallow();

    t.truthy(label.type() === 'label');
});
test('should add the passed "className" prop to the rendered node if passed.', t => {
    const label = shallow({className: 'testClassName'});

    t.truthy(label.hasClass('testClassName'));
});
