import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import GridItem from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"host.components.gridItem"', () => {
    it('should render a "div" node.', () => {
        const grid = shallow(<GridItem/>);

        expect(grid.type()).to.equal('div');
    });

    it('should add the passed "className" prop to the rendered div if passed.', () => {
        const grid = shallow(<GridItem className="test"/>);

        expect(grid).to.have.className('test');
    });

    it('should add the passed "width" prop to the inline-style of the rendered div.', () => {
        const grid = shallow(<GridItem width="half"/>);

        expect(grid).to.have.attr('style', 'width:50%;');
    });
});
