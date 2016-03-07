import {actions} from 'Host/Redux/';

export default dispatch => (contextPath, typoscriptPath) => {
    dispatch(actions.CR.Nodes.focus(contextPath, typoscriptPath));
    dispatch(actions.CR.Nodes.hover(contextPath, typoscriptPath));
};
