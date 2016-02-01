import Immutable from 'immutable';
import {
    $get,
    $mapGet,
    $set,
    $updateIn,
    $merge,
    $mergeDeep,
    $delete
} from './ImmutableOperations.js';

describe('"shared.utilities.immutableOperations" ', () => {
    describe('$get helper', () => {
        it('should return the given value of the passed key in a immutable map.', () => {
            const map = Immutable.fromJS({
                foo: 'bar'
            });

            expect($get(map, 'foo')).to.equal('bar');
        });

        it('should return the nested value of the passed key in a immutable map.', () => {
            const map = Immutable.fromJS({
                foo: {
                    baz: 'bar'
                }
            });

            expect($get(map, 'foo.baz')).to.equal('bar');
        });
    });

    describe('$mapGet helper', () => {
        it('should return a immutable list of values for the given path.', () => {
            const map = Immutable.fromJS([{
                foo: 1
            }, {
                baz: 2
            }]);

            expect($mapGet(map, 'foo')).to.be.an.instanceof(Immutable.List);
        });

        it('should filter the returned immutable list for values which are empty.', () => {
            const map = Immutable.fromJS([{
                foo: 1
            }, {
                baz: 2
            }]);

            expect($mapGet(map, 'foo').count()).to.equal(1);
        });
    });

    describe('$set helper', () => {
        it('should set the value to the given path.', () => {
            const map = Immutable.fromJS({
                foo: 1
            });
            const result = $set(map, 'foo', 3);

            expect(result.get('foo')).to.equal(3);
        });

        it('should set the value to the given nested path.', () => {
            const map = Immutable.fromJS({
                foo: {
                    bar: 1
                }
            });
            const result = $set(map, 'foo.bar', 3);

            expect(result.get('foo').get('bar')).to.equal(3);
        });
    });

    describe('$updateIn helper', () => {
        it('should mirror the updateIn method of immutable lists with nested paths support.', () => {
            const map = Immutable.fromJS({
                foo: 'bar',
                bar: {
                    baz: [{
                        baz: 1
                    }]
                }
            });
            const result = $updateIn(map, 'bar.baz', todos =>
                todos.push(Immutable.fromJS({baz: 2}))
            );

            expect(result.get('bar').get('baz').count()).to.equal(2);
        });
    });

    describe('$merge helper', () => {
        it('should mirror the mergeIn method with nested paths support.', () => {
            const map = Immutable.fromJS({
                foo: {
                    bar: ['a', 'b']
                }
            });
            const result = $merge(map, 'foo.bar', ['a', 'b', 'c']);

            expect(result.get('foo').get('bar').count()).to.equal(3);
        });
    });

    describe('$mergeDeep helper', () => {
        it('should mirror the mergeIn method with nested paths support.', () => {
            const map = Immutable.fromJS({
                foo: {
                    bar: {
                        baz: {
                            bat: 1
                        }
                    }
                }
            });
            const result = $mergeDeep(map, 'foo.bar', {
                baz: {
                    foo: 2
                }
            });

            expect(result.get('foo').get('bar').get('baz').count()).to.equal(2);
        });
    });

    describe('$delete helper', () => {
        it('should mirror the deleteIn method with nested paths support.', () => {
            const map = Immutable.fromJS({
                foo: {
                    bar: {
                        baz: {
                            bat: 1
                        }
                    }
                }
            });
            const result = $delete(map, 'foo.bar');

            expect(result.get('foo').get('bar')).to.be.an('undefined');
        });
    });
});
