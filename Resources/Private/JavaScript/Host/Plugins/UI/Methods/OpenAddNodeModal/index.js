import {actions} from 'Host/Redux/index';

export default dispatch => (contextPath, mode) => {
    dispatch(actions.UI.AddNodeModal.open(contextPath, mode));
};
