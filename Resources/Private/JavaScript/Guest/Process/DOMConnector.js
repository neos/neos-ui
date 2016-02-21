import {nodeComponent, inlineToolbar} from 'Guest/Components/';
import ckEditor from 'Guest/Components/Editors/CKEditorAdaptor/';

import render from './Render.js';

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
    // Initialize inline toolbar
    //
    const toolbar = render(inlineToolbar, {});
    document.body.appendChild(
        toolbar.dom
    );

    connection.observe('nodes.focused').react(res => {
        if (res.node) {
            toolbar.update(res);
            return;
        }

        toolbar.update({
            node: null,
            typoscriptPath: ''
        });
    });
};
