export default chain => filter => ({
    type: 'CHILDREN',
    payload: [filter]
});
