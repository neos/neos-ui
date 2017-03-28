export default () => filter => ({
    type: 'filteredChildren',
    payload: [filter]
});
