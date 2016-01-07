import {actions} from 'Host/Ducks/';
import uuid from 'uuid';

export default (feedback, envelope, store) => {
    const {message, severity} = feedback.payload;
    const timeout = severity.toLowerCase() === 'success' ? 5000 : 0;
    const id = uuid.v4();

    store.dispatch(actions.UI.FlashMessages.add(id, message, severity, timeout));
};
