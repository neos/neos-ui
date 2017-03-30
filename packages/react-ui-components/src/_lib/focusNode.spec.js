import sinon from 'sinon';
import {makeFocusNode} from './focusNode.js';

test('should return curried function.', () => {
    const fn = makeFocusNode();

    expect(typeof fn).toBe('function');
});
test('should not throw an error when calling the curried function without arguments.', () => {
    const fn = () => makeFocusNode()();

    expect(fn).not.toThrow();
});
test('should call the "blur" method on the given node of the curried function depending.', () => {
    const node = {
        blur: sinon.spy(),
        focus: sinon.spy()
    };

    makeFocusNode()(node);

    expect(node.blur.calledOnce).toBeTruthy();
    expect(node.focus.calledOnce).toBeFalsy();
});
test('should call the "focus" method on the given node of the curried function depending in case the first argument of the make function is truthy.', () => {
    const node = {
        blur: sinon.spy(),
        focus: sinon.spy()
    };

    makeFocusNode(true)(node);

    expect(node.blur.calledOnce).toBeFalsy();
    expect(node.focus.calledOnce).toBeTruthy();
});
