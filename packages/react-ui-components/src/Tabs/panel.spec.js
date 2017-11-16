import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Panel from './panel.js';

describe('<Panel/>', () => {
    let props;

    beforeEach(() => {
        props = {
            theme: {
                panel: 'panelBaseClassName'
            },
            children: 'Foo children'
        };
    });

    it('should render correctly.', () => {
        const wrapper = shallow(<Panel {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a "displayName" of "Panel".', () => {
        expect(Panel.displayName).toBe('Panel');
    });
});
