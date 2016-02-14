//
// Published by the Guest frame, as soon as it is fully loaded.
// Payload will be a large object with all immediate document information.
//
export const GUEST_DOCUMENT_LOADED = 'guest.document.loaded';

//
// Published by host and guest as soon as a node is focused
//
export const GUEST_NODE_FOCUSED = 'guest.node.focused';

//
// Published by guest as soon as a node is blurred
//
export const GUEST_NODE_BLURRED = 'guest.node.blurred';

//
// Published by guest as soon as mouse cursor passes a node
//
export const GUEST_NODE_MOUSEENTERED = 'guest.node.mouseentered';

//
// Published by guest as soon as mouse cursor leaves a node
//
export const GUEST_NODE_MOUSELEFT = 'guest.node.mouseleft';

//
// Published by host as soon as a node is focused
//
export const HOST_NODE_FOCUSED = 'host.node.focused';

//
// Published by host as soon as a node is blurred
//
export const HOST_NODE_BLURRED = 'host.node.blurred';

//
// Published by host as soon as mouse cursor passes a node
//
export const HOST_NODE_MOUSEENTERED = 'host.node.mouseentered';

//
// Published by host as soon as mouse cursor leaves a node
//
export const HOST_NODE_MOUSELEFT = 'host.node.mouseleft';
