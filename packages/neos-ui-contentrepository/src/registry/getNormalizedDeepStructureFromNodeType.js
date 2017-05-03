import {mapObjIndexed, values, sort, compose} from 'ramda';
import {$get} from 'plow-js';

const withId = mapObjIndexed((subject, id) => ({
    ...subject,
    id
}));
const getPosition = subject => ($get(['ui', 'inspector', 'position'], subject) || $get(['ui', 'position'], subject) || $get('position', subject) || 0);
const positionalArraySorter = sort((a, b) => {
    // If both items don't have position, retain order
    if (getPosition(a) === 0 && getPosition(b) === 0) {
        return 0;
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
    values,
    withId,
    $get(path)
);

export default getNormalizedDeepStructureFromNodeType;
