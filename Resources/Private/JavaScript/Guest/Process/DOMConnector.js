import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {nodeComponent} from 'Guest/Components/index';
import ckEditor from 'Guest/Components/Editors/CKEditorAdaptor/index';
import {InlineUI} from 'Guest/Containers/index';
import {configureStore} from 'Guest/Redux/index';

import initializeStoreSynchronization from './Synchronization.js';

const closestContextPath = el => {
    if (!el) {
        return null;
    }

    return el.dataset.__cheNodeContextpath || closestContextPath(el.parentNode);
};

export default (ui, connection) => {
    [].slice.call(document.querySelectorAll('a[href]')).forEach(link => {
        link.draggable = true;

        link.ondragstart = e => {
            e.dataTransfer.setData('href', link.href);
        };
    });

    //
    // Initialize node components
    //
    [].slice.call(document.querySelectorAll('[data-__che-node-contextpath]'))
        .forEach(dom => nodeComponent(dom, ui, connection));

    //
    // Initialize inline editors
    //
    [].slice.call(document.querySelectorAll('[data-__che-property]')).forEach(dom => {
        const contextPath = closestContextPath(dom);
        const propertyName = dom.dataset.__cheProperty;

        ckEditor({contextPath, propertyName}, dom, ui, connection);
    });

    //
    // Initialize Inline UI
    //
    const inlineUiContainer = document.createElement('div');
    inlineUiContainer.id = `neosInlineUi--${connection.id}`;
    document.body.appendChild(inlineUiContainer);

    //
    // Attach some source information to events that are fired
    // from withing the inline UI, so that if in doubt they can
    // be handled differently
    //
    const isolatedEvents = [
        'click',
        'dblclick',
        'drag',
        'dragend',
        'dragenter',
        'dragleave',
        'dragover',
        'dragstart',
        'drop',
        'focus',
        'focusin',
        'focusout',
        'keydown',
        'keypress',
        'keyup',
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'mousewheel'
    ];
    isolatedEvents.forEach(
        event => inlineUiContainer.addEventListener(event, e => {
            //
            // React captures its own events on document level - so we cannot stop propagation at this point.
            // We need to attach this flag on particular events that are passing through the application
            // container to then handle them differently (e.g. click outside)
            //
            e['@neos/inline-ui-event'] = true;
        })
    );

    //
    // Configure redux store
    //
    const store = configureStore();

    ReactDOM.render(
        <Provider store={store}>
            <InlineUI />
        </Provider>,
        inlineUiContainer
    );

    //
    // Initialize central store synchronization
    //
    initializeStoreSynchronization(ui, connection, store.dispatch);
};
