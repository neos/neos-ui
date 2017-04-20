import {striptags, striptagsEncoded} from './striptags';

test(`should strip html tags if string contains some`, () => {
    const string = '<p>hello world</p>';
    expect(striptags(string)).toEqual('hello world');
});

test(`should return the same string if string does not contain html tags`, () => {
    const string = 'hello world';
    expect(striptags(string)).toEqual(string);
});

test(`should strip html tags if string contains some`, () => {
    const string = '&lt;p&gt;hello world&lt;/p&gt;';
    expect(striptagsEncoded(string)).toEqual('hello world');
});

test(`should return the same string if string does not contain html tags`, () => {
    const string = 'hello world';
    expect(striptagsEncoded(string)).toEqual(string);
});
