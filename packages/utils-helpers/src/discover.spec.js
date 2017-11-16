import discover from './discover';

test(`should export a function`, () => {
    expect(typeof discover).toBe('function');
});

test(`should transform a generator function into a function that returns a Promise`, async () => {
    function * gen() {
        yield 1;
        yield 2;
        yield 3;
        return 4;
    }
    const result = await discover(gen);

    expect(result).toBe(4);
});
