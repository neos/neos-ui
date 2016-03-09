import {actions} from 'Host/Redux/';

export default dispatch => (message, severity = 'error') => {
    const id = String(Math.abs(Math.random() * 10000));

    dispatch(actions.UI.FlashMessages.add(id, message, severity));
};
