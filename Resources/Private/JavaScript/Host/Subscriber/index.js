import * as Nodes from './Nodes/';
import {initializeSubscribers} from 'Host/MiddleWares/Events/';

export default initializeSubscribers({
    ...Nodes
});
