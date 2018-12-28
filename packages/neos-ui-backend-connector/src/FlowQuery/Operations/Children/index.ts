export default () => (filter: string) => ({
    type: 'children',
    payload: [filter]
});
