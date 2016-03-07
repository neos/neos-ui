import {actions} from 'Host/Redux/';

export default dispatch => change => {
    dispatch(actions.Changes.add(change));
};
