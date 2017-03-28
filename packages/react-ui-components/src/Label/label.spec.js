import {createShallowRenderer} from './../_lib/testUtils.js';
import Label from './label.js';

const defaultProps = {
    theme: {},
    htmlFor: 'test for'
};
const shallow = createShallowRenderer(Label, defaultProps);

test('should render a "label" node.', () => {
    const label = shallow();

    expect(label.type()).toBe('label');
});
test('should add the passed "className" prop to the rendered node if passed.', () => {
    const label = shallow({className: 'testClassName'});

    expect(label.hasClass('testClassName')).toBeTruthy();
});
test('should render the passed "children".', () => {
    const label = shallow({children: 'Foo children'});

    expect(label.html().includes('Foo children')).toBeTruthy();
});
