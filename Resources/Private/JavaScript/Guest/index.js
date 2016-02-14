import {events} from 'Shared/Constants/';
import {domConnector} from './Process/';
import {inlineToolbar} from './Components/';

const {broadcast} = window.neos;
const {GUEST_DOCUMENT_LOADED} = events;
const DOMConnector = domConnector();

//
// Initialize the guest application as soon as the DOM has been fully initialized.
//
document.addEventListener('DOMContentLoaded', () => {
    broadcast.publish(GUEST_DOCUMENT_LOADED, {
        tabId: window.name,
        documentInformation: window['@PackageFactory.Guevara:DocumentInformation']
    });

    DOMConnector.run();
    document.body.appendChild(inlineToolbar());
});

//
// Forward click event to host frame, since this seems not to happen automatically *weird*
//
document.addEventListener('click', () => {
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
