import test from 'ava';
import sinon from 'sinon';
import {makeFocusNode} from './focusNode.js';

test('should return curried function.', t => {
    const fn = makeFocusNode();

    t.is(typeof fn, 'function');
});
test('should not throw an error when calling the curried function without arguments.', t => {
    const fn = () => makeFocusNode()();

    t.notThrows(fn);
});
test('should call the "blur" method on the given node of the curried function depending.', t => {
    const node = {
        blur: sinon.spy(),
        focus: sinon.spy()
    };

    makeFocusNode()(node);

    t.truthy(node.blur.calledOnce);
    t.falsy(node.focus.calledOnce);
});
test('should call the "focus" method on the given node of the curried function depending in case the first argument of the make function is truthy.', t => {
    const node = {
        blur: sinon.spy(),
        focus: sinon.spy()
    };

    makeFocusNode(true)(node);

    t.falsy(node.blur.calledOnce);
    t.truthy(node.focus.calledOnce);
});
