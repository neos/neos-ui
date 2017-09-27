export default () => (baseNodeType, loadingDepth) => ({
    type: 'neosUiDefaultNodes',
    payload: [baseNodeType, loadingDepth]
});
