import {actions} from 'Host/Redux/';

export default dispatch => (contextPath, typoscriptPath) => {
    dispatch(actions.Transient.Nodes.blur(contextPath, typoscriptPath));
};
