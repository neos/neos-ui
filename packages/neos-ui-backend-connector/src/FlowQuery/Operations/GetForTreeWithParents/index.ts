export default () => (nodeTypeFilter = null) => ({
    type: 'getForTreeWithParents',
    payload: {nodeTypeFilter}
});
