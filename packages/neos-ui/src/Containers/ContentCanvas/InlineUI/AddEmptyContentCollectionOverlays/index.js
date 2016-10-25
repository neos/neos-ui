import {Component, PropTypes} from 'react';

import style from './style.css';

export default class AddEmptyContentCollectionOverlays extends Component {
    shouldComponentUpdate(...args) {
        return false;
    }

    render() {
        const iframeDocument = document.getElementsByName('neos-content-main')[0].contentDocument;

        Array.prototype.forEach.call(iframeDocument.querySelectorAll('.neos-contentcollection'), (contentCollection) => {
            const hasChildNodes = contentCollection.querySelector('[data-__neos-node-contextpath]');
            const hasEmptyContentCollectionOverlay = contentCollection.querySelector(`.${style.addEmptyContentCollectionOverlay}`);
            if (!hasChildNodes && !hasEmptyContentCollectionOverlay) {
                const emptyContentCollectionOverlay = document.createElement('div');
                emptyContentCollectionOverlay.setAttribute('class', style.addEmptyContentCollectionOverlay);
                contentCollection.appendChild(emptyContentCollectionOverlay);
            }
        });

        return null;
    }
}
