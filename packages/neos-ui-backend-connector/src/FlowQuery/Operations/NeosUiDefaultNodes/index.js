export default () => (baseNodeType, loadingDepth, toggledNodes) => ({
    type: 'neosUiDefaultNodes',
    payload: [baseNodeType, loadingDepth, toggledNodes]
});
