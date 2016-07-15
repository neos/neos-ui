import addChange from './AddChange/index';
import addFlashMessage from './AddFlashMessage/index';
import blurNode from './BlurNode/index';
import focusNode from './FocusNode/index';
import hoverNode from './HoverNode/index';
import openAddNodeModal from './OpenAddNodeModal/index';
import unhoverNode from './UnhoverNode/index';

const initializeMethods = methodMap => dispatch => {
    const api = {};

    Object.keys(methodMap).forEach(key => {
        api[key] = methodMap[key](dispatch);
    });

    return api;
};

export default initializeMethods({
    addChange,
    addFlashMessage,
    blurNode,
    focusNode,
    hoverNode,
    openAddNodeModal,
    unhoverNode
});
