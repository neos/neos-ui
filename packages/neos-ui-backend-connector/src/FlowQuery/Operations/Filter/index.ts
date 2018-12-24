export default () => (filter: string) => ({
    type: 'filter',
    payload: [filter]
});
