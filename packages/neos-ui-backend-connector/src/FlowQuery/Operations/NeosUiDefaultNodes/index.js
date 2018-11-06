export default () => (baseNodeType, loadingDepth, toggledNodes, clipboardNodeContextPath) => ({
    type: 'neosUiDefaultNodes',
    payload: [baseNodeType, loadingDepth, toggledNodes, clipboardNodeContextPath]
});
