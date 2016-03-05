import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Headline from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"Headline" component', () => {
    it('should render a "h1" node if no "type" prop was passed.', () => {
        const headline = shallow(<Headline />);

        expect(headline.type()).to.equal('h1');
    });

    it('should add the passed "className" prop to the rendered node if passed.', () => {
        const headline = shallow(<Headline className="test" />);

        expect(headline).to.have.className('test');
    });

    it('should render a the appropriate node if a "type" prop was passed.', () => {
        expect(shallow(<Headline type="h2" />).type()).to.equal('h2');
        expect(shallow(<Headline type="h3" />).type()).to.equal('h3');
        expect(shallow(<Headline type="h4" />).type()).to.equal('h4');
        expect(shallow(<Headline type="h5" />).type()).to.equal('h5');
        expect(shallow(<Headline type="h6" />).type()).to.equal('h6');
    });
});
