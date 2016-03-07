import {actions} from 'Host/Redux/';

export default dispatch => (contextPath, typoscriptPath) => {
    dispatch(actions.CR.Nodes.blur(contextPath, typoscriptPath));
};
