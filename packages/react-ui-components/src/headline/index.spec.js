import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import Headline from './index.js';

test('<Headline/> should render a "h1" node if no "type" prop was passed.', t => {
    const headline = shallow(<Headline/>);

    t.truthy(headline.type() === 'h1');
});
test('<Headline/> should add the passed "className" prop to the rendered node if passed.', t => {
    const headline = shallow(<Headline className="test" />);

    t.truthy(headline.hasClass('test'));
});
test('<Headline/> should render a the appropriate node if a "type" prop was passed.', t => {
    t.truthy(shallow(<Headline type="h2" />).type() === 'h2');
    t.truthy(shallow(<Headline type="h3" />).type() === 'h3');
    t.truthy(shallow(<Headline type="h4" />).type() === 'h4');
    t.truthy(shallow(<Headline type="h5" />).type() === 'h5');
    t.truthy(shallow(<Headline type="h6" />).type() === 'h6');
});
