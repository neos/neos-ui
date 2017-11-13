import sinon from 'sinon';
import loadScript from './loadScript';

test(`should export a function`, () => {
    expect(typeof (loadScript)).toBe('function');
});

test(`should create a script tag with the given src and appended it into the DOMs <head/>.`, () => {
    const elements = [{appendChild: sinon.spy()}];
    const doc = {
        createElement: sinon.spy(() => ({})),
        getElementsByTagName: sinon.spy(() => elements)
    };

    loadScript('foo.js', doc);

    expect(doc.createElement.calledOnce).toBe(true);
    expect(doc.createElement.calledWith('script')).toBe(true);
    expect(elements[0].appendChild.calledOnce).toBe(true);
});

test(`should not append the created element if it was already appended into the DOMs <head/>.`, () => {
    const elements = [{appendChild: sinon.spy()}];
    const doc = {
        createElement: sinon.spy(() => ({})),
        getElementsByTagName: sinon.spy(() => elements)
    };

    loadScript('bar.js', doc);
    loadScript('bar.js', doc);

    expect(elements[0].appendChild.calledOnce).toBe(true);
});
