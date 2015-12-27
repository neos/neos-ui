import neosBackend from './Service/NeosBackend';
import domConnector from './Process/DOMConnector';

const NeosBackendService = neosBackend(window.parent);

NeosBackendService.documentManager.addConfiguration(window.name, window['@Neos:DocumentData']);

const DocumentData = NeosBackendService.documentManager.getConfiguration(window.name);
const DOMConnector = domConnector(NeosBackendService, DocumentData);

DOMConnector.run();
