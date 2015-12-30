import {backend} from './Service/';
import {domConnector} from './Process/';
import './style.css';

const {tabManager} = backend;

tabManager.commitDocumentLoad(window.name, window['@PackageFactory.Guevara:DocumentInformation']);

const DOMConnector = domConnector();

document.addEventListener('DOMContentLoaded', () => DOMConnector.run());

//
// Forward click event to host frame, since this seems not to happen automatically *weird*
//
document.addEventListener('click', (e) => {
    const parentDocument = window.parent.document;

    if (parentDocument.createEvent) {
        const eventObject = parentDocument.createEvent('MouseEvents');
        eventObject.initEvent('click', true, false);
        parentDocument.dispatchEvent(eventObject);
    } else if (parentDocument.createEventObject) {
        const eventObject = parentDocument.createEventObject();
        parentDocument.fireEvent('onclick', eventObject);
    }
});
