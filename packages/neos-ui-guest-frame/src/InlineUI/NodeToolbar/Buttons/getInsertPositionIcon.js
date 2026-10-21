import {InsertPosition} from '@neos-project/neos-ts-interfaces';

//
// Determine the arrow icon that visualizes the relative position the node will
// actually end up in - mirroring the semantics used by the button labels
//
const getInsertPositionIcon = (insertPosition, creationReference, insertsBelowExistingContent) => {
    if (creationReference) {
        // The node will be placed at the very top of the referenced collection
        return 'arrow-turn-up';
    }

    switch (insertPosition) {
        case InsertPosition.BEFORE:
            return 'arrow-up';

        case InsertPosition.AFTER:
            return 'arrow-down';

        default:
            // An "into" insertion is appended after the last child - so with existing
            // content it lands below it, while an empty collection has nothing below
            return insertsBelowExistingContent ? 'arrow-turn-down' : 'arrow-right';
    }
};

export default getInsertPositionIcon;
