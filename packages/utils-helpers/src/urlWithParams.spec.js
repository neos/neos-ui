import {urlWithParams} from './urlWithParams';

test(`should not alter URLs if params are empty`, () => {
    const url = 'https://neos.io';
    expect(urlWithParams(url)).toEqual(url);
});

test(`should not alter URLs if all param values are null`, () => {
    const url = 'https://some-domain.tld/';
    const params = {
        foo: null,
        bar: {
            baz: null
        }
    };
    expect(urlWithParams(url, params)).toEqual('https://some-domain.tld/');
});

test(`should add a simple value as query string`, () => {
    const url = 'https://neos.io';
    expect(urlWithParams(url, {page: 123})).toEqual('https://neos.io?page=123');
});

test(`should turn a simple array into a PHP compatible query string`, () => {
    const url = 'https://some-domain.tld/';
    expect(urlWithParams(url, {foo: ['bar', 'baz']})).toEqual('https://some-domain.tld/?foo%5B0%5D=bar&foo%5B1%5D=baz');
});

test(`should escape special characters in keys and values`, () => {
    const url = 'https://some-domain.tld';
    const params = {
        'füß': {
            'ba&': ['ä%', '"b"']
        },
        'bär': 'BaZ.'
    };
    expect(urlWithParams(url, params)).toEqual('https://some-domain.tld?f%C3%BC%C3%9F%5Bba%26%5D%5B0%5D=%C3%A4%25&f%C3%BC%C3%9F%5Bba%26%5D%5B1%5D=%22b%22&b%C3%A4r=BaZ.');
});

test(`should remove empty param values from query string`, () => {
    const url = 'https://some-domain.tld';
    const params = {
        foo: null,
        bar: {
            baz: null,
            foos: 1
        }
    };
    expect(urlWithParams(url, params)).toEqual('https://some-domain.tld?bar%5Bfoos%5D=1');
});

test(`should only include object properties in the query string`, () => {
    const url = 'http://www.domain.com';
    function Class() {
        this.foo = 'bar';
    }
    Class.prototype.baz = 'foos';
    const object = new Class();
    const params = {
        object
    };
    expect(urlWithParams(url, params)).toEqual('http://www.domain.com?object%5Bfoo%5D=bar');
});

test(`should convert params to strings`, () => {
    const url = 'http://www.domain.com';
    const params = {
        string: '123',
        number: 123,
        array: [1, 2, 3],
        true: true,
        false: false
    };
    expect(urlWithParams(url, params)).toEqual('http://www.domain.com?string=123&number=123&array%5B0%5D=1&array%5B1%5D=2&array%5B2%5D=3&true=true&false=false');
});

test(`should append params to existing query`, () => {
    const url = 'http://www.domain.com?some=existing&query=string';
    const params = {
        string: '123',
        number: 123,
        array: [1, 2, 3],
        true: true,
        false: false
    };
    expect(urlWithParams(url, params)).toEqual('http://www.domain.com?some=existing&query=string&string=123&number=123&array%5B0%5D=1&array%5B1%5D=2&array%5B2%5D=3&true=true&false=false');
});
