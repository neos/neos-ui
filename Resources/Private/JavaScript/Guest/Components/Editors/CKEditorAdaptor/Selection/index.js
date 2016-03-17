const defaultClientRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0
};

const defaultRegion = {
    bottom: 0,
    endRect: defaultClientRect,
    left: 0,
    right: 0,
    top: 0,
    startRect: defaultClientRect
};

//
// Get the current scroll position
//
const getScrollPosition = () => {
    const doc = document.documentElement;

    return {
        x: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        y: (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
    };
};

//
// Get all client rectangles for the given selection
//
const getClientRects = nativeSelection => {
    if (nativeSelection.createRange) {
        return nativeSelection.createRange().getClientRects();
    }

    return (nativeSelection.rangeCount > 0) ? [].slice.call(nativeSelection.getRangeAt(0).getClientRects()) : [];
};

//
// Get an object describing boundaries and client rectangles
// for the given selection
//
const getClientRectsRegion = (selection, nativeSelection) => {
    const clientRects = getClientRects(nativeSelection);

    if (clientRects.length === 0) {
        return defaultRegion;
    }

    const scrollPosition = getScrollPosition();
    const selectionRect = clientRects.reduce((a, b) => ({
        left: a.left < b.left ? a.left : b.left,
        right: a.right > b.right ? a.right : b.right,
        top: a.top < b.top ? a.top : b.top,
        bottom: a.bottom > b.bottom ? a.bottom : b.bottom
    }), {
        left: Infinity,
        right: -Infinity,
        top: Infinity,
        bottom: 0
    });
    const startRect = clientRects[0];
    const endRect = clientRects[clientRects.length - 1];

    return {
        left: scrollPosition.x + selectionRect.left,
        right: scrollPosition.x + selectionRect.right,
        bottom: scrollPosition.y + selectionRect.bottom,
        top: scrollPosition.y + selectionRect.top,
        startRect: {
            bottom: scrollPosition.y + startRect.bottom,
            height: startRect.height,
            left: scrollPosition.x + startRect.left,
            right: scrollPosition.x + startRect.right,
            top: scrollPosition.y + startRect.top,
            width: startRect.width
        },
        endRect: {
            bottom: scrollPosition.y + endRect.bottom,
            height: endRect.height,
            left: scrollPosition.x + endRect.left,
            right: scrollPosition.x + endRect.right,
            top: scrollPosition.y + endRect.top,
            width: endRect.width
        }
    };
};

//
// Get the direction of the current selection
//
const getSelectionDirection = (nativeSelection, ckApi) => {
    const {anchorNode, anchorOffset, focusNode, focusOffset} = nativeSelection;

    if (anchorNode && anchorNode.compareDocumentPosition) {
        const position = anchorNode.compareDocumentPosition(focusNode);

        if (!position && anchorOffset > focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            return ckApi.SELECTION_BOTTOM_TO_TOP;
        }
    }

    return ckApi.SELECTION_TOP_TO_BOTTOM;
};

//
// Get an object describing boundaries, client rectangles and direction
// for the given selection
//
const getSelectionRegion = (selection, nativeSelection, ckApi) => {
    const clientsRectRegion = getClientRectsRegion(selection, nativeSelection);
    const direction = getSelectionDirection(nativeSelection, ckApi);

    return {
        ...clientsRectRegion,
        direction,
        height: clientsRectRegion.bottom - clientsRectRegion.top,
        width: clientsRectRegion.right - clientsRectRegion.left
    };
};

//
// Expose a method to retrieve selection datas
//
// If the given selection is corrupt, return null
//
export default ckApi => editor => {
    const selection = editor.getSelection();
    const nativeSelection = selection.getNative();

    if (nativeSelection) {
        const element = selection.getSelectedElement();
        const text = selection.getSelectedText();
        const region = getSelectionRegion(selection, nativeSelection, ckApi);

        return {element, text, region};
    }

    return null;
};
