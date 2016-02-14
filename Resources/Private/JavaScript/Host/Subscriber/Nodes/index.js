import {events} from 'Shared/Constants/';
import {actions} from 'Host/Redux/';
import {createSubscriber} from 'Host/MiddleWares/Events/';

const {
    GUEST_DOCUMENT_LOADED,
    GUEST_NODE_FOCUSED,
    GUEST_NODE_BLURRED,
    GUEST_NODE_MOUSEENTERED,
    GUEST_NODE_MOUSELEFT,

    HOST_NODE_BLURRED,
    HOST_NODE_MOUSEENTERED,
    HOST_NODE_MOUSELEFT
} = events;

//
// When the guest frame is ready to provide us with document information,
// hydrate the result into the store
//
export const onGuestDocumentLoaded = createSubscriber(
    GUEST_DOCUMENT_LOADED,
    (event, payload, dispatch) => {
        const {tabId, documentInformation} = payload;

        dispatch(actions.Transient.Nodes.addBulk(documentInformation.nodes));

        dispatch(actions.UI.Tabs.setMetaData(tabId, Object.assign({
            title: tabId,
            workspace: {
                publishableNodes: []
            }
        }, documentInformation.metaData || {})));
    }
);

//
// When the guest frame notifies us of a node being focused,
// perform the according action that will forward this event
// back to the guest frame
//
export const onGuestNodeFocused = createSubscriber(
    GUEST_NODE_FOCUSED,
    (event, {contextPath, typoscriptPath}, dispatch) => {
        dispatch(actions.Transient.Nodes.focus(contextPath, typoscriptPath));
    }
);
//
// When the guest frame notifies us of a node being blurred,
// for now just forward the event
//
export const onGuestNodeBlurred = createSubscriber(
    GUEST_NODE_BLURRED,
    (event, {contextPath}, dispatch, publish) => {
        dispatch(actions.Transient.Nodes.blur(contextPath));
        publish(`${HOST_NODE_BLURRED}.${contextPath}`, contextPath);
    }
);

//
// When the guest frame notifies us of a node being focused,
// perform the according action that will forward this event
// back to the guest frame
//
export const onGuestNodeMouseEntered = createSubscriber(
    GUEST_NODE_MOUSEENTERED,
    (event, {contextPath}, dispatch, publish) => {
        publish(`${HOST_NODE_MOUSEENTERED}.${contextPath}`, contextPath);
    }
);

//
// When the guest frame notifies us of a node being focused,
// perform the according action that will forward this event
// back to the guest frame
//
export const onGuestNodeMouseLeft = createSubscriber(
    GUEST_NODE_MOUSELEFT,
    (event, {contextPath}, dispatch, publish) => {
        publish(`${HOST_NODE_MOUSELEFT}.${contextPath}`, contextPath);
    }
);
