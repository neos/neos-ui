import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import Icon from './icon.js';

let apiFixture;

test.beforeEach(() => {
    apiFixture = {
        fontAwesome: {
            getClassName: () => 'fooIconClassName',
            validateId: () => true
        },
        logger: {
            deprecate: sinon.spy()
        }
    };

    sinon.spy(console, 'error');
});
test.afterEach(() => console.error.restore());
test('<Icon/> should render a "i" node.', t => {
    const tag = shallow(<Icon api={apiFixture}/>);

    t.truthy(tag.type() === 'i');
});
test('<Icon/> should add the passed "className" prop to the rendered node if passed.', t => {
    const tag = shallow(<Icon className="test" api={apiFixture}/>);

    t.truthy(tag.hasClass('test'));
});
test('<Icon/> should call the "fontAwesome.getClassName" api method and render the returned className.', t => {
    const tag = shallow(<Icon api={apiFixture}/>);

    t.truthy(tag.hasClass('fooIconClassName'));
});
