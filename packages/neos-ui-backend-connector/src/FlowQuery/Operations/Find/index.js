export default () => filter => ({
    type: 'FIND',
    payload: [filter]
});
