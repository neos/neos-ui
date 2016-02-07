import {events} from 'Shared/Constants/';
import {actions} from 'Host/Redux/';
import {createSubscriber} from 'Host/Middlewares/Events/';

const {GUEST_DOCUMENT_LOADED} = events;

//
// When the guest frame is ready to provide us with document information,
// hydrate the result into the store
//
export const onGuestDocumentLoaded = createSubscriber(
    GUEST_DOCUMENT_LOADED,
    ({tabId, documentInformation}, dispatch) => {
        dispatch(actions.Transient.Nodes.addBulk(documentInformation.nodes));
    }
);
