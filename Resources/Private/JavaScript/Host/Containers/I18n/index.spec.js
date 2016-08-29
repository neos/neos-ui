import React from 'react';
import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import {shallow} from 'enzyme';
import sinonChai from 'sinon-chai';
import I18n from './index.js';

chai.should();
chai.use(sinonChai);

describe('"host.components.i18n"', () => {
    it('should render a "span" node.', () => {
        const tag = shallow(<I18n/>);

        expect(tag.type()).to.equal('span');
    });

    it('should initially have a loading label state.', () => {
        const tag = shallow(<I18n/>);

        expect(tag.state('label')).to.equal('Translation loading...');
    });

    it('should not call the "loadTranslation" method if the new "id" matches the old "id" prop.', () => {
        const tag = shallow(<I18n id="oldId"/>);
        const spy = sinon.spy(tag.instance(), 'loadTranslation');

        tag.setProps({
            id: 'oldId'
        });

        expect(spy).to.have.callCount(0);
    });

    it('should call the "loadTranslation" method if a new "id" was passed as a prop.', () => {
        const tag = shallow(<I18n id="oldId"/>);
        const spy = sinon.spy(tag.instance(), 'loadTranslation');

        tag.setProps({
            id: 'newId'
        });

        expect(spy).to.have.callCount(1);
    });

    it('should set the "fallback" prop as the label state if no i18n service can be called.', () => {
        const tag = shallow(<I18n id="oldId" fallback="My fallback"/>);

        tag.setProps({
            id: 'newId'
        });

        expect(tag.state('label')).to.equal('My fallback');
    });
});
