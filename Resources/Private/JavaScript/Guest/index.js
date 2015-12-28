import {neosBackend} from './Service/';
import {domConnector} from './Process/';
import './style.css';

const neosBackendService = neosBackend(window.parent);
const {tabManager} = neosBackendService;

tabManager.commitDocumentLoad(window.name, window['@PackageFactory.Guevara:DocumentInformation']);

const DOMConnector = domConnector(neosBackendService);

document.addEventListener('DOMContentLoaded', () => DOMConnector.run());
