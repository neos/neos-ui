import React from 'react';
import chai, {expect} from 'chai';
import sinon from 'sinon/pkg/sinon.js';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Icon from './index.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('"host.components.icon"', () => {
    it('should render a "i" node.', () => {
        const tag = shallow(<Icon />);

        expect(tag.type()).to.equal('i');
    });

    it('should add the passed "className" prop to the rendered node if passed.', () => {
        const tag = shallow(<Icon className="test" />);

        expect(tag).to.have.className('test');
    });

    it('should throw an error if an invalid "icon" prop id was passed.', () => {
        const fn = () => shallow(<Icon icon="test" />);

        expect(fn).not.throw('Icon name "test" was not a found in Font-Awesome');
    });

    it('should throw no error if an valid "icon" prop id was passed.', () => {
        const fn = () => shallow(<Icon icon="search" />);

        expect(fn).to.not.throw();
    });

    it('should log a warning if a "icon" prop id was passed which need to be migrated.', () => {
        const spy = sinon.spy(console, 'warn');

        shallow(<Icon icon="icon-star" />);
        expect(spy).to.have.been.called;  // eslint-disable-line
    });
});
