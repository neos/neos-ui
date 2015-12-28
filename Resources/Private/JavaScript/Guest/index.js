import {neosBackend} from './Service/';
import {domConnector} from './Process/';
import './style.css';

const neosBackendService = neosBackend(window.parent);
const {documentManager} = neosBackendService;

documentManager.addConfiguration(window.name, window['@Neos:DocumentData']);

const DocumentData = documentManager.getConfiguration(window.name);
const DOMConnector = domConnector(neosBackendService, DocumentData);

DOMConnector.run();
