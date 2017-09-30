import positionalArraySorter from './positionalArraySorter';

test(`Circulare dependencie`, () => {
    const source = [
        {position: 'after kkk2', key: 'qqq'},
        {position: 'end 10'},
        {position: 'end', key: 'kkk'},
        {key: 'kkk2', position: 'after qqq'}
    ];
    const result = [
        {position: 'end', key: 'kkk'},
        {position: 'end 10'},
        {position: 'after kkk2', key: 'qqq'},
        {key: 'kkk2', position: 'after qqq'}
    ];
    expect(positionalArraySorter(source)).toEqual(result);
});

// TODO: write more tests
