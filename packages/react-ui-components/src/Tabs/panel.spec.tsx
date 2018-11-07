import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Panel, {PanelProps} from './panel';

describe('<Panel/>', () => {
    const props: PanelProps = {
        title: 'TitleString',
        theme: {
            panel: 'panelBaseClassName',
            'tabNavigation__itemBtnIcon--hasLabel': 'hasLabelClassName'
        },
        children: [<div key={'foo'}>'Foo children'</div>]
    };

    it('should render correctly.', () => {
        const wrapper = shallow(<Panel {...props}/>);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a "displayName" of "Panel".', () => {
        expect(Panel.displayName).toBe('Panel');
    });
});
