import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Icon from './icon.js';

let shallow;

test.beforeEach(() => {
    const apiFixture = {
        fontAwesome: {
            getClassName: () => 'fooIconClassName',
            validateId: () => true
        },
        logger: {
            deprecate: sinon.spy()
        }
    };
    const defaultProps = {
        theme: {},
        api: apiFixture
    };
    shallow = createShallowRenderer(Icon, defaultProps);

    sinon.spy(console, 'error');
});
test.afterEach(() => console.error.restore());
test('<Icon/> should render a "i" node.', t => {
    const tag = shallow();

    t.truthy(tag.type() === 'i');
});
test('<Icon/> should add the passed "className" prop to the rendered node if passed.', t => {
    const tag = shallow({className: 'testClassName'});

    t.truthy(tag.hasClass('testClassName'));
});
test('<Icon/> should call the "fontAwesome.getClassName" api method and render the returned className.', t => {
    const tag = shallow();

    t.truthy(tag.hasClass('fooIconClassName'));
});
