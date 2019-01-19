export default () => (index: number | 'ALL' = 'ALL') => ({
    type: 'get',
    payload: index
});
