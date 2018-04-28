import {mapObjIndexed, values, compose} from 'ramda';
import {$get} from 'plow-js';

const withId = mapObjIndexed((subject, id) => ({
    ...subject,
    id
}));

const getNormalizedDeepStructureFromNodeType = path => compose(
    values,
    withId,
    $get(path)
);

export default getNormalizedDeepStructureFromNodeType;
