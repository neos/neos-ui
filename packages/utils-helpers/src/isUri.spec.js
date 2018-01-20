import {isUri} from './isUri';

test(`Should return false for empty uri string`, () => {
    const uri = '';
    expect(isUri(uri)).toEqual(false);
});

test(`Should return false for empty uri string with some whitespaces`, () => {
    const uri = '   ';
    expect(isUri(uri)).toEqual(false);
});

test(`Should return false for uri param equals null`, () => {
    const uri = null;
    expect(isUri(uri)).toEqual(false);
});

test(`Should return false for uri param undefined`, () => {
    const uri = undefined;
    expect(isUri(uri)).toEqual(false);
});

test(`Should return false for uri param as object`, () => {
    const uri = {foo: 'bar'};
    expect(isUri(uri)).toEqual(false);
});

test(`Should return false for uri string with whitespaces and no protocol`, () => {
    const uri = '   foo';
    expect(isUri(uri)).toEqual(false);
});

test(`Should return false for uri string with node://`, () => {
    const uri = 'node://83932e1e-aec0-4208-a95a-78b7e1b22690';
    expect(isUri(uri)).toEqual(false);
});

test(`Should return true for uri string with http://`, () => {
    const uri = 'http://foo.bar';
    expect(isUri(uri)).toEqual(true);
});

test(`Should return true for uri string with https://`, () => {
    const uri = 'https://foo.bar';
    expect(isUri(uri)).toEqual(true);
});

test(`Should return true for uri string with news://`, () => {
    const uri = 'news://foo.bar';
    expect(isUri(uri)).toEqual(true);
});

test(`Should return true for uri string with ftp://`, () => {
    const uri = 'ftp://foo.bar';
    expect(isUri(uri)).toEqual(true);
});

test(`Should return true for uri string with tel:`, () => {
    const uri = 'tel:012324354';
    expect(isUri(uri)).toEqual(true);
});

test(`Should return true for uri string with mailto:`, () => {
    const uri = 'mailto:foo@bar.com';
    expect(isUri(uri)).toEqual(true);
});
