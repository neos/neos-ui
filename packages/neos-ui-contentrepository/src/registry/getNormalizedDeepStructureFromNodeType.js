import {mapObjIndexed, values, sort, compose, map, addIndex} from 'ramda';
import {$get} from 'plow-js';

const withId = mapObjIndexed((subject, id) => ({
    ...subject,
    id
}));

const mapIndexed = addIndex(map);
const withOriginalSortingIndex = mapIndexed((item, index) => ({
    ...item,
    _originalSortingIndex: index
}));

const getPosition = subject => ($get(['ui', 'inspector', 'position'], subject) || $get(['ui', 'position'], subject) || $get('position', subject) || 0);
const positionalArraySorter = sort((a, b) => {
    // If both items don't have position, retain original sorting order
    if (getPosition(a) === 0 && getPosition(b) === 0) {
        return a._originalSortingIndex - b._originalSortingIndex;
    }
    // If only item `a` doesn't have position, push it down
    if (getPosition(a) === 0) {
        return 1;
    }
    // If only item `b` doesn't have position, push it down
    if (getPosition(b) === 0) {
        return -1;
    }
    // If both items have position, sort them in a standard way
    return getPosition(a) - getPosition(b);
});

const getNormalizedDeepStructureFromNodeType = path => compose(
    positionalArraySorter,
    withOriginalSortingIndex,
    values,
    withId,
    $get(path)
);

export default getNormalizedDeepStructureFromNodeType;
