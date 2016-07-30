import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {noop, renderJSX} from 'jsx-test-helpers';
import {fixtureFactory} from './../_lib/testUtils.js';

import Button from './index.js';

const defaultProps = {
    children: 'Foo children'
};
const fixture = props => <div {...props} onDragOver={noop} onDrop={noop}/>;
const generateFixture = fixtureFactory(fixture, defaultProps);

// test('<Button/> should render the passed "className" prop to the rendered wrapper if passed.', (t) => {
//     const props = {className: 'test'};
//     const actual = renderJSX(
//         <Button {...defaultProps} {...props} position="top"/>
//     );
//     const expected = generateFixture(props);
//
//     t.deepEqual(actual, expected);
// });
//
// test('<Button/> should call the passed "onDrop" prop when clicking the button.', (t) => {
//     const props = {onDrop: sinon.spy()};
//
//     renderJSX(
//         <Button {...defaultProps} {...props}/>,
//         render => render.props.onDrop({preventDefault: noop})
//     );
//
//     t.truthy(props.onDrop.calledOnce);
// });

// import React from 'react';
// import chai, {expect} from 'chai';
// import sinon from 'sinon/pkg/sinon.js';
// import {shallow} from 'enzyme';
// import chaiEnzyme from 'chai-enzyme';
// import sinonChai from 'sinon-chai';
//
// chai.should();
// chai.use(sinonChai);
// chai.use(chaiEnzyme());
//
// describe('"host.components.button"', () => {
//     it('should render a "button" node with the role="button" attribute.', () => {
//         const btn = shallow(<Button />);
//
//         expect(btn.type()).to.equal('button');
//     });
//
//     it('should add the passed "className" prop to the rendered button if passed.', () => {
//         const btn = shallow(<Button className="test" />);
//
//         expect(btn).to.have.className('test');
//     });
//
//     it('should call the passed "onClick" prop when clicking the button.', () => {
//         const spy = sinon.spy();
//         const btn = shallow(<Button onClick={spy} />);
//
//         btn.simulate('click');
//
//         expect(spy).to.have.callCount(1);
//     });
//
//     it('should call the passed "onMouseDown" prop when clicking the button.', () => {
//         const spy = sinon.spy();
//         const btn = shallow(<Button onMouseDown={spy} />);
//
//         btn.simulate('mouseDown');
//
//         expect(spy).to.have.callCount(1);
//     });
//
//     it('should call the passed "onMouseUp" prop when clicking the button.', () => {
//         const spy = sinon.spy();
//         const btn = shallow(<Button onMouseUp={spy} />);
//
//         btn.simulate('mouseUp');
//
//         expect(spy).to.have.callCount(1);
//     });
//
//     it('should call the passed "onMouseEnter" prop when clicking the button.', () => {
//         const spy = sinon.spy();
//         const btn = shallow(<Button onMouseEnter={spy} />);
//
//         btn.simulate('mouseEnter');
//
//         expect(spy).to.have.callCount(1);
//     });
//
//     it('should call the passed "onMouseLeave" prop when clicking the button.', () => {
//         const spy = sinon.spy();
//         const btn = shallow(<Button onMouseLeave={spy} />);
//
//         btn.simulate('mouseLeave');
//
//         expect(spy).to.have.callCount(1);
//     });
//
//     it('should add the disabled attribute when passing a truthy "isDisabled" prop.', () => {
//         const btn = shallow(<Button isDisabled={true} />);
//
//         expect(btn).to.have.attr('disabled');
//     });
// });
