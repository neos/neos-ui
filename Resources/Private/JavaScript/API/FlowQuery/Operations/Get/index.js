export default chain => (index = 'ALL') => ({
    type: 'GET',
    payload: index
});
