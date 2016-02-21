import {actions} from 'Host/Redux/';

export default dispatch => change => {
    dispatch(actions.Transient.Changes.add(change));
};
