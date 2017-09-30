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
const positionalArraySorter = (subject, positionKey = 'position', idKey = 'key') => {
    // Extract all position keys from the subject
    const positionsArray = subject.map(value => positionKey in value ? value[positionKey] : 0);
    // Extract valid id keys
    const validKeys = subject.map(value => idKey in value && value[idKey]).filter(i => i).map(i => String(i));

    const middleKeys = [];
    const startKeys = [];
    const endKeys = [];
    const beforeKeys = [];
    const afterKeys = [];
    const corruptKeys = [];

    // Split all positions into start, end, before, after and middle keys
    positionsArray.forEach((value, index) => {
        if (isNaN(value) === false) {
            middleKeys.push([index, Number(value)]);
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
                const keyMatch = value.match(/before\s+(\w+)/);
                const key = keyMatch && keyMatch[1];
                if (key && validKeys.includes(key)) {
                    beforeKeys.push([index, key]);
                } else {
                    corruptKeys.push(index);
                    console.warn('The following position value is corrupt: %s', value);
                }
            } else if (value.includes('after')) {
                const keyMatch = value.match(/after\s+(\w+)/);
                const key = keyMatch && keyMatch[1];
                if (key && validKeys.includes(key)) {
                    afterKeys.push([index, key]);
                } else {
                    corruptKeys.push(index);
                    console.warn('The following position value is corrupt: %s', value);
                }
            } else {
                corruptKeys.push(index);
                console.warn('The following position value is corrupt: %s', value);
            }
        } else {
            corruptKeys.push(index);
            console.warn('The following position value is corrupt: %s', value);
        }
    });

    const sortByWeightFunc = (a, b) => a[1] - b[1];

    // Merged array of all sorted indexes, except for before and after
    let sortedIndexes = [].concat(
        startKeys.sort(sortByWeightFunc).map(pair => pair[0]),
        middleKeys.sort(sortByWeightFunc).map(pair => pair[0]),
        corruptKeys,
        endKeys.sort(sortByWeightFunc).map(pair => pair[0])
    );

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
            console.warn('Circular reference detected. Append broken entries at the end.');
            sortedIndexes = sortedIndexes.concat(
                beforeKeys.map(pair => pair[0]),
                afterKeys.map(pair => pair[0])
            );
            break;
        }
    }

    return sortedIndexes.map(index => subject[index]);
};
export default positionalArraySorter;
