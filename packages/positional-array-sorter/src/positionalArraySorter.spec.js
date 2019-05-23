import positionalArraySorter from './positionalArraySorter';

test('Position end should put element to end', () => {
    const source = [
        {key: 'second', position: 'end'},
        {key: 'first'}
    ];
    const result = [
        {key: 'first'},
        {key: 'second', position: 'end'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position start should put element to start', () => {
    const source = [
        {key: 'second'},
        {key: 'first', position: 'start'}
    ];
    const result = [
        {key: 'first', position: 'start'},
        {key: 'second'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position start should respect priority', () => {
    const source = [
        {key: 'second', position: 'start 50'},
        {key: 'first', position: 'start 52'}
    ];
    const result = [
        {key: 'first', position: 'start 52'},
        {key: 'second', position: 'start 50'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position end should respect priority', () => {
    const source = [
        {key: 'second', position: 'end 17'},
        {key: 'first', position: 'end'}
    ];
    const result = [
        {key: 'first', position: 'end'},
        {key: 'second', position: 'end 17'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Positional numbers are in the middle', () => {
    const source = [
        {key: 'last', position: 'end'},
        {key: 'second', position: '17'},
        {key: 'first', position: '5'},
        {key: 'third', position: '18'}
    ];
    const result = [
        {key: 'first', position: '5'},
        {key: 'second', position: '17'},
        {key: 'third', position: '18'},
        {key: 'last', position: 'end'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position before adds before named element if present', () => {
    const source = [
        {key: 'second'},
        {key: 'first', position: 'before second'}
    ];
    const result = [
        {key: 'first', position: 'before second'},
        {key: 'second'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position before adds after start if named element not present', () => {
    const source = [
        {key: 'third'},
        {key: 'second', position: 'before third'},
        {key: 'first', position: 'before unknown'}
    ];
    const result = [
        {key: 'first', position: 'before unknown'},
        {key: 'second', position: 'before third'},
        {key: 'third'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position before uses priority when referencing the same element; The higher the priority the closer before the element gets added.', () => {
    const source = [
        {key: 'third'},
        {key: 'second', position: 'before third'},
        {key: 'first', position: 'before third 12'}
    ];
    const result = [
        {key: 'second', position: 'before third'},
        {key: 'first', position: 'before third 12'},
        {key: 'third'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position before works recursively', () => {
    const source = [
        {key: 'third'},
        {key: 'second', position: 'before third'},
        {key: 'first', position: 'before second'}
    ];
    const result = [
        {key: 'first', position: 'before second'},
        {key: 'second', position: 'before third'},
        {key: 'third'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position after adds after named element if present', () => {
    const source = [
        {key: 'second', position: 'after first'},
        {key: 'first'}
    ];
    const result = [
        {key: 'first'},
        {key: 'second', position: 'after first'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position after adds before end if named element not present', () => {
    const source = [
        {key: 'second', position: 'after unknown'},
        {key: 'third', position: 'end'},
        {key: 'first'}
    ];
    const result = [
        {key: 'first'},
        {key: 'second', position: 'after unknown'},
        {key: 'third', position: 'end'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position after uses priority when referencing the same element; The higher the priority the closer after the element gets added.', () => {
    const source = [
        {key: 'third', position: 'after first'},
        {key: 'second', position: 'after first 12'},
        {key: 'first'}
    ];
    const result = [
        {key: 'first'},
        {key: 'second', position: 'after first 12'},
        {key: 'third', position: 'after first'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Position after works recursively', () => {
    const source = [
        {key: 'third', position: 'after second'},
        {key: 'second', position: 'after first'},
        {key: 'first'}
    ];
    const result = [
        {key: 'first'},
        {key: 'second', position: 'after first'},
        {key: 'third', position: 'after second'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Array keys may contain special characters', () => {
    const source = [
        {key: 'thi:rd', position: 'end'},
        {key: 'sec.ond', position: 'before thi:rd'},
        {key: 'fir-st', position: 'before sec.ond'}
    ];
    const result = [
        {key: 'fir-st', position: 'before sec.ond'},
        {key: 'sec.ond', position: 'before thi:rd'},
        {key: 'thi:rd', position: 'end'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('numerical string-positions work like numbers', () => {
    const source = [
        {},
        {position: '100'},
        {position: 10},
        {position: '1'},
        {position: 1000}
    ];
    const result = [
        {},
        {position: '1'},
        {position: 10},
        {position: '100'},
        {position: 1000}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Should gracefully handle circular references', () => {
    const source = [
        {position: 'before abc2', key: 'abc1'},
        {position: 'before abc3', key: 'abc2'},
        {position: 'before abc1', key: 'abc3'},
        {position: 'end', key: 'plain-key'}
    ];
    const result = [
        {position: 'before abc3', key: 'abc2'},
        {position: 'before abc1', key: 'abc3'},
        {position: 'before abc2', key: 'abc1'},
        {position: 'end', key: 'plain-key'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Handles non-word keys', () => {
    const source = [
        {position: 'after $#@!'},
        {key: '$#@!'},
        {position: 'before $#@!'}
    ];
    const result = [
        {position: 'before $#@!'},
        {key: '$#@!'},
        {position: 'after $#@!'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Handle invalid position strings', () => {
    const source = [
        {position: 10},
        {position: 'after'},
        {position: 'end'},
        {position: 'before'},
        {position: 'twenty'}
    ];
    const result = [
        {position: 'after'},
        {position: 'before'},
        {position: 'twenty'},
        {position: 10},
        {position: 'end'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test('Access position value by callback', () => {
    const source = [
        {__meta: {position: 'end'}},
        {__meta: {position: 'start'}},
        {}
    ];
    const result = [
        {__meta: {position: 'start'}},
        {},
        {__meta: {position: 'end'}}
    ];
    expect(positionalArraySorter(source, e => e.__meta ? e.__meta.position : undefined)).toEqual(result);
});
