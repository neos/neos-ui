import {editors, nodeComponent, inlineToolbar} from 'Guest/Components/';
import {render} from 'Guest/Process/';

const {richTextEditor} = editors;

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
        .forEach(contentElement => nodeComponent(contentElement, ui, connection));

    //
    // Initialize inline editors
    //
    [].slice.call(document.querySelectorAll('[data-__che-property]')).forEach(contentElement => {
        const contextPath = closestContextPath(contentElement);
        const property = contentElement.dataset.__cheProperty;

        richTextEditor(contentElement, property, contextPath);
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
