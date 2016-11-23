export default () => filter => ({
    type: 'CHILDREN',
    payload: [filter]
});
