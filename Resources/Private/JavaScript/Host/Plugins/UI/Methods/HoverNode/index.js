import {actions} from 'Host/Redux/';

export default dispatch => (contextPath, typoscriptPath) => {
    dispatch(actions.Transient.Nodes.hover(contextPath, typoscriptPath));
};
