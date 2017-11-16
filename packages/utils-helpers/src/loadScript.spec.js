import loadScript from './loadScript';

test(`should export a function`, () => {
    expect(typeof (loadScript)).toBe('function');
});

test(`should create a script tag with the given src and appended it into the DOMs <head/>.`, () => {
    const elements = [{appendChild: jest.fn()}];
    const doc = {
        createElement: jest.fn(() => ({})),
        getElementsByTagName: jest.fn(() => elements)
    };

    loadScript('foo.js', doc);

    expect(doc.createElement.mock.calls.length).toBe(1);
    expect(doc.createElement.mock.calls[0]).toEqual(['script']);
    expect(elements[0].appendChild.mock.calls.length).toBe(1);
});

test(`should not append the created element if it was already appended into the DOMs <head/>.`, () => {
    const elements = [{appendChild: jest.fn()}];
    const doc = {
        createElement: jest.fn(() => ({})),
        getElementsByTagName: jest.fn(() => elements)
    };

    loadScript('bar.js', doc);
    loadScript('bar.js', doc);

    expect(elements[0].appendChild.mock.calls.length).toBe(1);
});
