import {events} from 'Shared/Constants/';
import {domConnector} from './Process/';
import {inlineToolbar} from './Components/';

const {ui} = window.neos;
const DOMConnector = domConnector();
const connection = ui.connect();

//neosUi.observe('nodes.focused').then(val => console.log(val));

//
// Initialize the guest application as soon as the DOM has been fully initialized.
//
document.addEventListener('DOMContentLoaded', () => {
    ui.setDocumentInformation(window.name, window['@PackageFactory.Guevara:DocumentInformation']);
    DOMConnector.run(ui, connection);
    document.body.appendChild(inlineToolbar(ui, connection));
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
