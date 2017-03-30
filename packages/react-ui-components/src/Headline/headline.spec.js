import {createShallowRenderer} from './../_lib/testUtils.js';
import Headline from './headline.js';

const defaultProps = {
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(Headline, defaultProps);

test('should render a "h1" node if no "type" prop was passed.', () => {
    const headline = shallow();

    expect(headline.type()).toBe('h1');
});
test('should add the passed "className" prop to the rendered node if passed.', () => {
    const headline = shallow({className: 'testClassName'});

    expect(headline.hasClass('testClassName')).toBeTruthy();
});
test('should render a the appropriate node if a "type" prop was passed.', () => {
    expect(shallow({type: 'h2'}).type()).toBe('h2');
    expect(shallow({type: 'h3'}).type()).toBe('h3');
    expect(shallow({type: 'h4'}).type()).toBe('h4');
    expect(shallow({type: 'h5'}).type()).toBe('h5');
    expect(shallow({type: 'h6'}).type()).toBe('h6');
});
