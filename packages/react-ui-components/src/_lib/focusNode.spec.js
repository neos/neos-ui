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
        blur: jest.fn(),
        focus: jest.fn()
    };

    makeFocusNode()(node);

    expect(node.blur.mock.calls.length).toBe(1);
    expect(node.focus.mock.calls.length).toBe(0);
});
test('should call the "focus" method on the given node of the curried function depending in case the first argument of the make function is truthy.', () => {
    const node = {
        blur: jest.fn(),
        focus: jest.fn()
    };

    makeFocusNode(true)(node);

    expect(node.blur.mock.calls.length).toBe(0);
    expect(node.focus.mock.calls.length).toBe(1);
});
