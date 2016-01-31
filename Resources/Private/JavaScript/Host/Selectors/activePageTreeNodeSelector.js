import {createSelector} from 'reselect';

function findActiveNode(nodes) {
    return nodes && nodes.reduce((previous, current) => {
        let returnValue;
        if (previous) {
            returnValue = previous;
        } else if (current.get('isActive')) {
            returnValue = current;
        } else {
            returnValue = findActiveNode(current.get('children'));
        }
        return returnValue;
    }, null);
}

export const activePageTreeNodeSelector = createSelector(
  state => state.ui.pageTree,
  pageTree => findActiveNode(pageTree)
);
