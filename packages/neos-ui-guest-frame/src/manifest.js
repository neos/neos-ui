import {Map} from 'immutable';
import {$get} from 'plow-js';

import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {selectors} from '@neos-project/neos-ui-redux-store';

import makeInitializeGuestFrame from './initializeGuestFrame';
import initializePropertyDomNode from './initializePropertyDomNode';
import initializeContentDomNode from './initializeContentDomNode';
import {
    findNodeInGuestFrame,
    findAllOccurrencesOfNodeInGuestFrame,
    findRelativePropertiesInGuestFrame,
    createEmptyContentCollectionPlaceholderIfMissing
} from './dom';

import style from './style.css';

manifest('@neos-project/neos-ui-guestframe', {}, globalRegistry => {
    const guestFrameRegistry = new SynchronousRegistry(`
        # Registry for guest-frame specific functionalities
    `);

    guestFrameRegistry.add('makeInitializeGuestFrame', makeInitializeGuestFrame);
    globalRegistry.add('@neos-project/neos-ui-guestframe', guestFrameRegistry);

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

        const nodes = new Map({
            [contextPath]: selectors.CR.Nodes.byContextPathSelector(contextPath)(store.getState())
        });
        const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
        const inlineEditorRegistry = globalRegistry.get('inlineEditors');

        if (parentElement.querySelector(`.${style.addEmptyContentCollectionOverlay}`)) {
            parentElement.querySelector(`.${style.addEmptyContentCollectionOverlay}`).remove();
        }

        initializeContentDomNode({nodes})(contentElement);
        findRelativePropertiesInGuestFrame(contentElement).forEach(
            initializePropertyDomNode({
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
