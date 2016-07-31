import test from 'ava';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Headline from './headline.js';

const defaultProps = {
    children: 'Foo children',
    theme: {}
};
const shallow = createShallowRenderer(Headline, defaultProps);

test('should render a "h1" node if no "type" prop was passed.', t => {
    const headline = shallow();

    t.is(headline.type(), 'h1');
});
test('should add the passed "className" prop to the rendered node if passed.', t => {
    const headline = shallow({className: 'testClassName'});

    t.truthy(headline.hasClass('testClassName'));
});
test('should render a the appropriate node if a "type" prop was passed.', t => {
    t.is(shallow({type: 'h2'}).type(), 'h2');
    t.is(shallow({type: 'h3'}).type(), 'h3');
    t.is(shallow({type: 'h4'}).type(), 'h4');
    t.is(shallow({type: 'h5'}).type(), 'h5');
    t.is(shallow({type: 'h6'}).type(), 'h6');
});
