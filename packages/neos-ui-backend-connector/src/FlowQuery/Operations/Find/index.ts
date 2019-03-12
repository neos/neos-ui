export default () => (filter: string) => ({
    type: 'find',
    payload: [filter]
});
