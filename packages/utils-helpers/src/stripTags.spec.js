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
