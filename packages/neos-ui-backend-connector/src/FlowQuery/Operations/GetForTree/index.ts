export default () => (index: number | 'ALL' = 'ALL') => ({
    type: 'getForTree',
    payload: index
});
