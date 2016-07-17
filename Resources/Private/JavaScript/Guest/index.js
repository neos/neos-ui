import 'Shared/Styles/style.css';
import 'babel-polyfill';
import {domConnector} from './Process/index';
import {api} from 'Shared/Utilities/';

const {ui} = api.get();

//
// Fail-safe in case the API is not properly setup. (F.e. in unit tests or broken environments)
//
if (ui) {
    const connection = ui.connect();

    //
    // Propagate errors of the Guest frame to the Host FlashMessages.
    //
    window.onerror = function (err) {
        console.error(err);
        ui.addFlashMessage(`Whoops. Something went wrong in the guest frame. Error message states "${err}".`);
        console.error(err);
    };

    //
    // Initialize the guest application as soon as the DOM has been fully initialized.
    //
    document.addEventListener('DOMContentLoaded', () => {
        domConnector(ui, connection);
        ui.setDocumentInformation(window.name, window['@Neos.Neos.Ui:DocumentInformation']);
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
} else {
    throw new Error('Neos - Guest Application did not properly setup since the global API object is not valid.');
}
