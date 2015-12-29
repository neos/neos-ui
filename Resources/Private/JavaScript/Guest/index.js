import {backend} from './Service/';
import {domConnector} from './Process/';
import './style.css';

const {tabManager} = backend;

tabManager.commitDocumentLoad(window.name, window['@PackageFactory.Guevara:DocumentInformation']);

const DOMConnector = domConnector();

document.addEventListener('DOMContentLoaded', () => DOMConnector.run());
