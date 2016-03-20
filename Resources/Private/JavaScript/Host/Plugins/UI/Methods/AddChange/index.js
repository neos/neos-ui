import {actions} from 'Host/Redux/index';

export default dispatch => change => {
    dispatch(actions.Changes.persistChange(change));
};
