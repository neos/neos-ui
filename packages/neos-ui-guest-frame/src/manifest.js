import {Map} from 'immutable';
import {$get} from 'plow-js';

import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {selectors} from '@neos-project/neos-ui-redux-store';

import makeInitializeGuestFrame from './initializeGuestFrame';

import initializeContentDomNode from './initializeContentDomNode';
import {
    findNodeInGuestFrame,
    findAllOccurrencesOfNodeInGuestFrame,
    createEmptyContentCollectionPlaceholderIfMissing,
    findAllChildNodes
} from './dom';
import InlineUI from './InlineUI';

import style from './style.css';

manifest('@neos-project/neos-ui-guestframe', {}, globalRegistry => {
    const guestFrameRegistry = new SynchronousRegistry(`
        # Registry for guest-frame specific functionalities

        This registry consists of two entries:

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
    `);

    guestFrameRegistry.add('makeInitializeGuestFrame', makeInitializeGuestFrame);
    guestFrameRegistry.add('InlineUIComponent', InlineUI);
    globalRegistry.add('@neos-project/neos-ui-guest-frame', guestFrameRegistry);

    const serverFeedbackHandlers = globalRegistry.get('serverFeedbackHandlers');

    //
    // When the server advices to render a new node, put the delivered html to the
    // corrent place inside the DOM
    //
    serverFeedbackHandlers.add('Neos.Neos.Ui:RenderContentOutOfBand', (feedbackPayload, {store, globalRegistry}) => {
        const {contextPath, renderedContent, parentDomAddress, siblingDomAddress, mode} = feedbackPayload;
        const parentElement = parentDomAddress && findNodeInGuestFrame(
            parentDomAddress.contextPath,
            parentDomAddress.fusionPath
        );
        const siblingElement = siblingDomAddress && findNodeInGuestFrame(
            siblingDomAddress.contextPath,
            siblingDomAddress.fusionPath
        );
        const contentElement = (new DOMParser())
            .parseFromString(renderedContent, 'text/html')
            .querySelector(`[data-__neos-node-contextpath="${contextPath}"]`);

        switch (mode) {
            case 'before':
                siblingElement.parentNode.insertBefore(contentElement, siblingElement);
                break;

            case 'after':
                siblingElement.parentNode.insertBefore(contentElement, siblingElement.nextSibling);
                break;

            case 'into':
            default:
                parentElement.appendChild(contentElement);
                break;
        }

        const children = findAllChildNodes(contentElement);

        const nodes = new Map(
            Object.assign(
                {[contextPath]: selectors.CR.Nodes.byContextPathSelector(contextPath)(store.getState())},
                ...children.map(el => {
                    const contextPath = el.getAttribute('data-__neos-node-contextpath');
                    return {[contextPath]: selectors.CR.Nodes.byContextPathSelector(contextPath)(store.getState())};
                })
            )
        );
        const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
        const inlineEditorRegistry = globalRegistry.get('inlineEditors');

        if (parentElement.querySelector(`.${style.addEmptyContentCollectionOverlay}`)) {
            parentElement.querySelector(`.${style.addEmptyContentCollectionOverlay}`).remove();
        }

        //
        // Initialize the newly rendered node and all nodes that came with it
        //
        [contentElement, ...children].forEach(
            initializeContentDomNode({
                store,
                globalRegistry,
                nodeTypesRegistry,
                inlineEditorRegistry,
                nodes
            })
        );
    });

    //
    // When the server has removed a node, remove it as well from the dom
    //
    serverFeedbackHandlers.add('Neos.Neos.Ui:RemoveNode', ({contextPath, parentContextPath}, {store}) => {
        const state = store.getState();

        if ($get('ui.contentCanvas.contextPath', state) !== contextPath) {
            findAllOccurrencesOfNodeInGuestFrame(contextPath).forEach(el => {
                const closestContentCollection = el.closest('.neos-contentcollection');
                el.remove();

                createEmptyContentCollectionPlaceholderIfMissing(closestContentCollection);
            });
        }
    });
});
