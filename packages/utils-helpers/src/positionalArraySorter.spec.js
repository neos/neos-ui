import positionalArraySorter from './positionalArraySorter';

test(`Middle`, () => {
    const source = [
        {position: '100'},
        {position: 10},
        {position: '1'},
        {position: 1000}
    ];
    const result = [
        {position: '1'},
        {position: 10},
        {position: '100'},
        {position: 1000}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test(`Start`, () => {
    const source = [
        {position: 'start 100'},
        {position: 'start 10'},
        {position: 'start 1'},
        {position: 'start 1000'}
    ];
    const result = [
        {position: 'start 1'},
        {position: 'start 10'},
        {position: 'start 100'},
        {position: 'start 1000'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test(`End`, () => {
    const source = [
        {position: 'end 100'},
        {position: 'end 10'},
        {position: 'end 1'},
        {position: 'end 1000'}
    ];
    const result = [
        {position: 'end 1'},
        {position: 'end 10'},
        {position: 'end 100'},
        {position: 'end 1000'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test(`Before`, () => {
    const source = [
        {key: 'abc'},
        {position: 'before abc'},
        {position: 'before abc', key: 1},
        {position: 'before 1'}
    ];
    const result = [
        {position: 'before abc'},
        {position: 'before 1'},
        {position: 'before abc', key: 1},
        {key: 'abc'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test(`After`, () => {
    const source = [
        {position: 'after abc'},
        {position: 'after abc', key: 1},
        {position: 'after 1'},
        {key: 'abc'}
    ];
    const result = [
        {key: 'abc'},
        {position: 'after abc', key: 1},
        {position: 'after 1'},
        {position: 'after abc'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});

test(`Circulare reference go to the end (before)`, () => {
    const source = [
        {position: 'before abc2', key: 'abc1'},
        {position: 'before abc3', key: 'abc2'},
        {position: 'before abc1', key: 'abc3'},
        {position: 'end', key: 'plain-key'}
    ];
    const result = [
        {position: 'end', key: 'plain-key'},
        {position: 'before abc2', key: 'abc1'},
        {position: 'before abc3', key: 'abc2'},
        {position: 'before abc1', key: 'abc3'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test(`Circulare reference go to the end (after)`, () => {
    const source = [
        {position: 'after abc2', key: 'abc1'},
        {position: 'after abc3', key: 'abc2'},
        {position: 'after abc1', key: 'abc3'},
        {position: 'end', key: 'plain-key'}
    ];
    const result = [
        {position: 'end', key: 'plain-key'},
        {position: 'after abc2', key: 'abc1'},
        {position: 'after abc3', key: 'abc2'},
        {position: 'after abc1', key: 'abc3'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test(`Corrupt keys go after the middle`, () => {
    const source = [
        {position: {}},
        {position: 'blah blah'},
        {position: 'after abc'},
        {position: 'after'},
        {position: 'before abc'},
        {position: 'before'},
        {position: 'after abc1'},
        {key: 'some-key'}
    ];
    const result = [
        {key: 'some-key'},
        {position: {}},
        {position: 'blah blah'},
        {position: 'after abc'},
        {position: 'after'},
        {position: 'before abc'},
        {position: 'before'},
        {position: 'after abc1'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
test(`Altogether`, () => {
    const source = [
        {position: 'end 10'},
        {position: 'start', key: 'cba1'},
        {position: 'after abc3', key: 'abc2'},
        {position: 'start 10'},
        {position: 'after abc2', key: 'abc1'},
        {position: 'end', key: 'abc3'},
        {position: '0'},
        {position: 0},
        {position: 'before cba1', key: 'cba2'},
        {position: 'after abc1'},
        {position: '10'},
        {position: 'before cba2', key: 'cba3'},
        {position: 10},
        {position: 'before cba3'}
    ];
    const result = [
        {position: 'before cba3'},
        {position: 'before cba2', key: 'cba3'},
        {position: 'before cba1', key: 'cba2'},
        {position: 'start', key: 'cba1'},
        {position: 'start 10'},
        {position: '0'},
        {position: 0},
        {position: '10'},
        {position: 10},
        {position: 'end', key: 'abc3'},
        {position: 'after abc3', key: 'abc2'},
        {position: 'after abc2', key: 'abc1'},
        {position: 'after abc1'},
        {position: 'end 10'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});
