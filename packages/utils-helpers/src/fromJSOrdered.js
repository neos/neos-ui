import Immutable from 'immutable';

export default function fromJSOrdered(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Immutable.Seq(js).map(fromJSOrdered).toList() :
            Immutable.Seq(js).map(fromJSOrdered).toOrderedMap();
}
