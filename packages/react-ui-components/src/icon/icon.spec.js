import test from 'ava';
import sinon from 'sinon';
import {createShallowRenderer} from './../_lib/testUtils.js';
import Icon from './icon.js';

const defaultProps = {
    theme: {},
    api: {
        logger: {
            deprecate: sinon.spy()
        }
    },
    validateId: id => ({isValid: true, isMigrationNeeded: false, iconName: id}),
    getIconClassName: id => id
};
const shallow = createShallowRenderer(Icon, defaultProps);

test('should render a "i" node.', t => {
    const tag = shallow();

    t.truthy(tag.type() === 'i');
});
test('should add the passed "className" prop to the rendered node if passed.', t => {
    const tag = shallow({className: 'testClassName'});

    t.truthy(tag.hasClass('testClassName'));
});
test('should call the "fontAwesome.getClassName" api method and render the returned className.', t => {
    const tag = shallow({icon: 'fooIconClassName'});

    t.truthy(tag.hasClass('fooIconClassName'));
});
