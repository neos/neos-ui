import 'Shared/Styles/style.css';
import {domConnector} from './Process/index';

const {ui} = window.neos;
const connection = ui.connect();

//
// Propagate errors of the Guest frame to the Host FlashMessages.
//
window.onerror = function (err) {
    ui.addFlashMessage(`Whoops. Something went wrong in the guest frame. Error message states "${err}".`);
};

//
// Initialize the guest application as soon as the DOM has been fully initialized.
//
document.addEventListener('DOMContentLoaded', () => {
    ui.setDocumentInformation(window.name, window['@PackageFactory.Guevara:DocumentInformation']);
    domConnector(ui, connection);
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
