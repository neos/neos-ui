import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Grid from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"Grid" component', () => {
    it('should render a "div" node.', () => {
        const grid = shallow(<Grid />);

        expect(grid.type()).to.equal('div');
    });

    it('should add the passed "className" prop to the rendered div if passed.', () => {
        const grid = shallow(<Grid className="test" />);

        expect(grid).to.have.className('test');
    });
});
