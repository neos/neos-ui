const isOriginal = (value: any) => value && value.indexOf && value.indexOf('_original_') === 0;
const getOriginal = (value: any) => value && value.substring && Number(value.substring(10));

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
    // Extract all position keys from the subject.
    // If the position is not in the value, we encode its original position into a string
    // to preserve original sort order later
    const positionsArray = subject.map((value, index) => {
        const position = positionAccessor(value);
        return position === undefined ? `_original_${index}` : position;
    });
    // Extract valid id keys
    const validKeys = subject.map(value => idKey in value && value[idKey]).filter(i => i).map(i => String(i));

    const middleKeys: Array<[Index, any]> = [];
    const startKeys: Array<[Index, number]> = [];
    const endKeys: Array<[Index, number]> = [];
    const beforeKeys: Array<[Index, string]> = [];
    const afterKeys: Array<[Index, string]> = [];
    const corruptKeys: number[] = [];

    // Split all positions into start, end, before, after and middle keys
    positionsArray.forEach((value, index) => {
        if (isNaN(value) === false || isOriginal(value)) {
            middleKeys.push([index, value]);
        } else if (typeof value === 'string') {
            if (value.includes('start')) {
                const weightMatch = value.match(/start\s+(\d+)/);
                const weight = (weightMatch && weightMatch[1]) || 0;
                startKeys.push([index, Number(weight)]);
            } else if (value.includes('end')) {
                const weightMatch = value.match(/end\s+(\d+)/);
                const weight = (weightMatch && weightMatch[1]) || 0;
                endKeys.push([index, Number(weight)]);
            } else if (value.includes('before')) {
                const keyMatch = value.match(/before\s+(\S+)/);
                const key = keyMatch && keyMatch[1];
                if (key && validKeys.includes(key)) {
                    beforeKeys.push([index, key]);
                } else {
                    corruptKeys.push(index);
                    console.warn('The following position value is corrupt: %s', value); // tslint:disable-line no-console
                }
            } else if (value.includes('after')) {
                const keyMatch = value.match(/after\s+(\S+)/);
                const key = keyMatch && keyMatch[1];
                if (key && validKeys.includes(key)) {
                    afterKeys.push([index, key]);
                } else {
                    corruptKeys.push(index);
                    console.warn('The following position value is corrupt: %s', value); // tslint:disable-line no-console
                }
            } else {
                corruptKeys.push(index);
                console.warn('The following position value is corrupt: %s', value); // tslint:disable-line no-console
            }
        } else {
            corruptKeys.push(index);
            console.warn('The following position value is corrupt: %s', value); // tslint:disable-line no-console
        }
    });

    const sortByWeightFunc = (a: [any, number], b: [any, number]) => a[1] - b[1];
    const sortWithRetainingOriginalPos = (_a: [any, string | number], _b: [any, string | number]) => {
        const a = _a[1];
        const b = _b[1];
        // If both items don't have position, retain original sorting order
        if (isOriginal(a) && isOriginal(b)) {
            return getOriginal(a) - getOriginal(b);
        }
        // If only item `a` doesn't have position, push it down
        if (typeof a === 'string' && a.includes && a.includes('_original_')) {
            return 1;
        }
        // If only item `b` doesn't have position, push it down
        if (typeof b === 'string' && b.includes && b.includes('_original_')) {
            return -1;
        }
        // If both items have position, sort them in a standard way
        return Number(a) - Number(b);
    };


    // Merged array of all sorted indexes, except for before and after
    let sortedIndexes = [
        ...startKeys.sort(sortByWeightFunc).map(pair => pair[0]),
        ...middleKeys.sort(sortWithRetainingOriginalPos).map(pair => pair[0]),
        ...corruptKeys,
        ...endKeys.sort(sortByWeightFunc).map(pair => pair[0])
    ];

    // Go through all before and after keys and move them to the right position in sortedIndexes.
    // We may need multiple iterations for this, as before or after keys may point at one another.
    while (beforeKeys.length > 0 || afterKeys.length > 0) {
        let alteredNumber = 0;
        beforeKeys.forEach((pair, index) => { // eslint-disable-line no-loop-func
            const targetIndexInSubject = subject.findIndex(item => String(item[idKey]) === pair[1]);
            const indexInIndexes = sortedIndexes.findIndex(item => item === targetIndexInSubject);
            if (indexInIndexes !== -1) {
                sortedIndexes.splice(indexInIndexes, 0, pair[0]);
                beforeKeys.splice(index, 1);
                alteredNumber++;
            }
        });
        afterKeys.forEach((pair, index) => { // eslint-disable-line no-loop-func
            const targetIndexInSubject = subject.findIndex(item => String(item[idKey]) === pair[1]);
            const indexInIndexes = sortedIndexes.findIndex(item => item === targetIndexInSubject);
            if (indexInIndexes !== -1) {
                sortedIndexes.splice(indexInIndexes + 1, 0, pair[0]);
                afterKeys.splice(index, 1);
                alteredNumber++;
            }
        });

        // If no operations were performed in a loop, it means we got stuck in a circular reference.
        // Break out of it and just append faulty values at the end.
        if (alteredNumber === 0) {
            console.warn('Circular reference detected. Append broken entries at the end.'); // tslint:disable-line no-console
            sortedIndexes = sortedIndexes.concat(
                beforeKeys.map(pair => pair[0]),
                afterKeys.map(pair => pair[0])
            );
            break;
        }
    }
    // TODO fix type assertion
    return sortedIndexes.map(index => subject[index]) as T;
};
export default positionalArraySorter;
