export default () => (filter: string) => ({
    type: 'neosUiFilteredChildren',
    payload: [filter]
});
