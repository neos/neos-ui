import {actions} from 'Host/Redux/index';

export default dispatch => (contextPath, typoscriptPath) => {
    dispatch(actions.CR.Nodes.blur(contextPath, typoscriptPath));
};
