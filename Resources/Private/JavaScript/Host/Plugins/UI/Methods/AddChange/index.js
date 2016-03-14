import {actions} from 'Host/Redux/index';

export default dispatch => change => {
    dispatch(actions.Changes.add(change));
};
