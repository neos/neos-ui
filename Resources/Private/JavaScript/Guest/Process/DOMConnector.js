import {editors, nodeComponent} from 'Guest/Components/';

const {richTextEditor} = editors;

function closestContextPath(el) {
    if (!el) {
        return null;
    }

    return el.dataset.__cheNodeContextpath || closestContextPath(el.parentNode);
}

class DOMConnector {
    constructor() {
        this.contentComponents = {};
    }

    run() {
        [].slice.call(document.querySelectorAll('a[href]')).forEach(link => {
            link.draggable = true;

            link.ondragstart = e => {
                e.dataTransfer.setData('href', link.href);
            };
        });

        [].slice.call(document.querySelectorAll('[data-__che-node-contextpath]'))
            .forEach(contentElement => nodeComponent(contentElement));

        [].slice.call(document.querySelectorAll('[data-__che-property]')).forEach(contentElement => {
            const contextPath = closestContextPath(contentElement);
            const property = contentElement.dataset.__cheProperty;

            richTextEditor(contentElement, property, contextPath);
        });
    }
}

export default () => new DOMConnector();
