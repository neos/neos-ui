export default () => (term, filterNodeType) => ({
    type: 'search',
    payload: [term, filterNodeType]
});
