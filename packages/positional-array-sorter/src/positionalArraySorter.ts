interface Value {
    [propName: string]: any;
}
type Index = number;

/**
 * Flexible array sorter that sorts an array according to a "position" meta data.
 * The expected format for the subject is:
 *
 * [
 *   [
 *     'key' => 'bar'
 *     'position' => '<position-string>',
 *   ],
 *   [
 *     'key' => 'baz'
 *     'position' => '<position-string>',
 *   ],
 * ]
 *
 * The <position-string> supports one of the following syntax:
 *  start (<weight>)
 *  end (<weight>)
 *  before <key> (<weight>)
 *  after <key> (<weight>)
 *  <numerical-order>
 *
 * where "weight" is the priority that defines which of two conflicting positions overrules the other,
 * "key" is a string that references another key in the subject
 * and "numerical-order" is an integer that defines the order independently from the other keys.
 */
type PositionAccessor = (value: Value) => string | number;
const positionalArraySorter = <T extends Value[]>(subject: T, position: string | PositionAccessor = 'position', idKey = 'key'): T => {
    const positionAccessor = typeof position === 'string' ? (value: Value) => value[position] : position;
    // internally we work with string representations of the index/item-key
    const indexMapping: {[key: string]: Index} = {};
    // all "normal" keys with numerical or no "position", grouped by that position
    const middleKeys: {[position: number]: string[]} = {};
    // all keys of items with "position" "start*" grouped by weight
    const startKeys: {[weight: number]: string[]} = {};
    // all keys of items with "position" "end*" grouped by weight
    const endKeys: {[weight: number]: string[]} = {};
    // all keys of items with "position" "before*" grouped by reference key, grouped by weight
    const beforeKeys: {[key: string]: {[weight: number]: string[]}} = {};
    // all keys of items with "position" "after*" grouped by reference key, grouped by weight
    const afterKeys: {[key: string]: {[weight: number]: string[]}} = {};

    // group items
    subject.forEach((item, index) => {
        const key = item[idKey] ? item[idKey] : String(index);
        indexMapping[key] = index;
        const positionValue = positionAccessor(item);
        const position = String(positionValue ? positionValue : index);
        let invalid = false;
        if (position.startsWith('start')) {
            const weightMatch = position.match(/start\s+(\d+)/);
            const weight = weightMatch && weightMatch[1] ? Number(weightMatch[1]) : 0;
            if (!startKeys[weight]) {
                startKeys[weight] = [];
            }
            startKeys[weight].push(key);
        }
        else if (position.startsWith('end')) {
            const weightMatch = position.match(/end\s+(\d+)/);
            const weight = weightMatch && weightMatch[1] ? Number(weightMatch[1]) : 0;
            if (!endKeys[weight]) {
                endKeys[weight] = [];
            }
            endKeys[weight].push(key);
        }
        else if (position.startsWith('before')) {
            const match = position.match(/before\s+(\S+)(\s+(\d+))?/);
            if (!match) {
                invalid = true;
            } else {
                const reference = match[1];
                const weight = match[3] ? Number(match[3]) : 0;
                if (!beforeKeys[reference]) {
                    beforeKeys[reference] = {};
                }
                if (!beforeKeys[reference][weight]) {
                    beforeKeys[reference][weight] = [];
                }
                beforeKeys[reference][weight].push(key);
            }
        }
        else if (position.startsWith('after')) {
            const match = position.match(/after\s+(\S+)(\s+(\d+))?/);
            if (!match) {
                invalid = true;
            } else {
                const reference = match[1];
                const weight = match[3] ? Number(match[3]) : 0;
                if (!afterKeys[reference]) {
                    afterKeys[reference] = {};
                }
                if (!afterKeys[reference][weight]) {
                    afterKeys[reference][weight] = [];
                }
                afterKeys[reference][weight].push(key);
            }
        }
        else {
            invalid = true;
        }
        if (invalid) {
            let numberPosition = parseFloat(position);
            if (isNaN(numberPosition) || !isFinite(numberPosition)) {
                numberPosition = index;
            }
            if (!middleKeys[numberPosition]) {
                middleKeys[numberPosition] = [];
            }
            middleKeys[numberPosition].push(key);
        }
    });

    const resultStart: string[] = [];
    const resultMiddle: string[] = [];
    const resultEnd: string[] = [];
    const processedKeys: string[] = [];

    // helper function to retrieve all weights in e.g. beforeKeys[...] in the necessary order
    const sortedWeights = (dict: {[key: number]: any}, asc: boolean) => {
        const weights = Object.keys(dict).map(x => Number(x)).sort((a, b) => a - b);
        return asc ? weights : weights.reverse();
    };
    // helper function to add all keys of a grouping to a then ordered result set considering before and after keys
    const addToResults = (keys: string[], result: string[]) => {
        keys.forEach(key => {
            if (processedKeys.indexOf(key) >= 0) {
                return;
            }
            processedKeys.push(key);
            if (beforeKeys[key]) {
                const beforeWeights = sortedWeights(beforeKeys[key], true);
                for (const i of beforeWeights) {
                    addToResults(beforeKeys[key][i], result);
                }
            }
            result.push(key);
            if (afterKeys[key]) {
                const afterWeights = sortedWeights(afterKeys[key], false);
                for (const i of afterWeights) {
                    addToResults(afterKeys[key][i], result);
                }
            }
        });
    };

    // add all start* keys weighted in descending order
    for (const i of sortedWeights(startKeys, false)) {
        addToResults(startKeys[i], resultStart);
    }
    // add all middle keys weighted in ascending order
    for (const i of sortedWeights(middleKeys, true)) {
        addToResults(middleKeys[i], resultMiddle);
    }
    // add all after* keys weighted in ascending order
    for (const i of sortedWeights(endKeys, true)) {
        addToResults(endKeys[i], resultEnd);
    }
    // orphaned items
    for (const key of Object.keys(beforeKeys)) {
        if (processedKeys.indexOf(key) >= 0) {
            continue;
        }
        // add all "orphaned" before* key in descending order before the middle keys
        for (const i of sortedWeights(beforeKeys[key], false)) {
            addToResults(beforeKeys[key][i], resultStart);
        }
    }
    for (const key of Object.keys(afterKeys)) {
        if (processedKeys.indexOf(key) >= 0) {
            continue;
        }
        // add all "orphaned" after* key in descending order before the end* keys
        for (const i of sortedWeights(afterKeys[key], false)) {
            addToResults(afterKeys[key][i], resultMiddle);
        }
    }
    const sortedKeys = [...resultStart, ...resultMiddle, ...resultEnd];
    // TODO fix type assertion
    return sortedKeys.map(key => indexMapping[key]).map(i => subject[i]) as T;
};
export default positionalArraySorter;
