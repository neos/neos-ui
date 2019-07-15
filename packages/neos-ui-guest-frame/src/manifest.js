import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import makeInitializeGuestFrame from './initializeGuestFrame';

import InlineUI from './InlineUI';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './InlineUI/NodeToolbar/Buttons/index';

manifest('@neos-project/neos-ui-guestframe', {}, globalRegistry => {
    const guestFrameRegistry = new SynchronousRegistry(`
        # Registry for guest-frame specific functionalities

        This registry consists of the following entries:

        ## makeInitializeGuestFrame

        This function is a factory that is supposed to return a generator function. It takes an object with the
        following structure as its first parameter:

            {globalRegistry, store}

        Wherein \`globalRegistry\` refers to the central registry for extensibility and \`store\` refers to the
        redux store.

        \`makeInitializeGuestFrame\` should return a function that takes care of augmenting the guest frame content with
        functionality relevant to the Neos UI (like the initialization of inline editors).

        ## InlineUIComponent

        This is supposed to be a react component, that will be rendered inside the guest frame. As a default this
        consists of the Inline node toolbar that can be seen, if a node is selected inside the frame.

        ## NodeToolbar/Buttons/*

        This are react components for the buttons for the Node Toolbar, so that you can add new buttons.

    `);

    guestFrameRegistry.set('makeInitializeGuestFrame', makeInitializeGuestFrame);
    guestFrameRegistry.set('InlineUIComponent', InlineUI);

    guestFrameRegistry.set('NodeToolbar/Buttons/AddNode', AddNode);
    guestFrameRegistry.set('NodeToolbar/Buttons/HideSelectedNode', HideSelectedNode);
    guestFrameRegistry.set('NodeToolbar/Buttons/CopySelectedNode', CopySelectedNode);
    guestFrameRegistry.set('NodeToolbar/Buttons/CutSelectedNode', CutSelectedNode);
    guestFrameRegistry.set('NodeToolbar/Buttons/PasteClipBoardNode', PasteClipBoardNode);
    guestFrameRegistry.set('NodeToolbar/Buttons/DeleteSelectedNode', DeleteSelectedNode);

    globalRegistry.set('@neos-project/neos-ui-guest-frame', guestFrameRegistry);
});
