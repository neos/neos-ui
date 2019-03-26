import {stripTags, stripTagsEncoded} from './stripTags';

test(`should strip html tags if string contains some`, () => {
    const string = '<p>hello world</p>';
    expect(stripTags(string)).toEqual('hello world');
});

test(`should return the same string if string does not contain html tags`, () => {
    const string = 'hello world';
    expect(stripTags(string)).toEqual(string);
});

test(`should strip html tags if string contains some`, () => {
    const string = '&lt;p&gt;hello world&lt;/p&gt;';
    expect(stripTagsEncoded(string)).toEqual('hello world');
});

test(`should return the same string if string does not contain html tags`, () => {
    const string = 'hello world';
    expect(stripTagsEncoded(string)).toEqual(string);
});

test(`stripTagsEncoded should throw a type error if parameter is not a string`, () => {
    expect(() => stripTagsEncoded(undefined)).toThrow(TypeError);
    expect(() => stripTagsEncoded(null)).toThrow(TypeError);
    expect(() => stripTagsEncoded([])).toThrow(TypeError);
    expect(() => stripTagsEncoded(1)).toThrow(TypeError);
});

test(`stripTags should throw a type error if parameter is not a string`, () => {
    expect(() => stripTags(undefined)).toThrow(TypeError);
    expect(() => stripTags(null)).toThrow(TypeError);
    expect(() => stripTags([])).toThrow(TypeError);
    expect(() => stripTags(1)).toThrow(TypeError);
});
