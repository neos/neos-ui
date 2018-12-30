import SynchronousRegistry from './SynchronousRegistry';

const prepareTestRegistry = () => {
    const testRegistry = new SynchronousRegistry('# Test registry');
    testRegistry.set('test/a', {test: 'a'}, 'after test/b');
    testRegistry.set('test/b', {test: 'b'});
    testRegistry.set('test', {test: 'c'});
    return testRegistry;
};

test(`Should be able to set description`, () => {
    const testRegistry = new SynchronousRegistry('# Test registry');
    expect(testRegistry.description).toEqual('# Test registry');
});

test(`Set and get simple object`, () => {
    const testRegistry = new SynchronousRegistry('# Test registry');
    const testObject = {test: 'test'};
    testRegistry.set('test', testObject);
    expect(testRegistry.get('test')).toEqual(testObject);
});

test(`Set should return the value`, () => {
    const testRegistry = new SynchronousRegistry('# Test registry');
    const testObject = {test: 'test'};
    expect(testRegistry.set('test', testObject)).toEqual(testObject);
});

test(`Setting the same key twice should override the old value`, () => {
    const testRegistry = new SynchronousRegistry('# Test registry');
    testRegistry.set('test', {test: 'old'});
    testRegistry.set('test', {test: 'new'});
    const expectedResult = {
        test: {test: 'new'}
    };
    expect(testRegistry.getAllAsObject('test')).toEqual(expectedResult);
});

test(`getChildren should return unsorted children in the same order`, () => {
    const testRegistry = new SynchronousRegistry('# Test registry');
    testRegistry.set('test/a', {test: 'a'});
    testRegistry.set('test/b', {test: 'b'});
    const expectedResult = [
        {test: 'a'},
        {test: 'b'}
    ];
    expect(testRegistry.getChildren('test')).toEqual(expectedResult);
});

test(`getChildren should return sorted children`, () => {
    const testRegistry = prepareTestRegistry();
    const expectedResult = [
        {test: 'b'},
        {test: 'a'}
    ];
    expect(testRegistry.getChildren('test')).toEqual(expectedResult);
});

test(`getChildrenAsObject should return a sorted object`, () => {
    const testRegistry = prepareTestRegistry();
    const expectedResult = {
        'test/b': {test: 'b'},
        'test/a': {test: 'a'}
    };
    expect(testRegistry.getChildrenAsObject('test')).toEqual(expectedResult);
});

test(`getAllAsObject should return a sorted object`, () => {
    const testRegistry = prepareTestRegistry();
    const expectedResult = {
        'test/b': {test: 'b'},
        'test/a': {test: 'a'},
        'test': {test: 'c'}
    };
    expect(testRegistry.getAllAsObject()).toEqual(expectedResult);
});

test(`getAllAsList should return a sorted list with ids`, () => {
    const testRegistry = prepareTestRegistry();
    const expectedResult = [
        {id: 'test/b', test: 'b'},
        {id: 'test/a', test: 'a'},
        {id: 'test', test: 'c'}
    ];
    expect(testRegistry.getAllAsList()).toEqual(expectedResult);
});

test(`has should work`, () => {
    const testRegistry = prepareTestRegistry();
    expect(testRegistry.has('test')).toBe(true);
    expect(testRegistry.has('tes')).toBe(false);
});
