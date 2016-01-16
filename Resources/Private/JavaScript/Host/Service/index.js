import backend from './Backend.js';
import changeManager from './ChangeManager.js';
import feedbackManager from './FeedbackManager.js';
import i18n from './I18n.js';
import {nodeTypeManager, nodeTreeService, publishingService} from './TYPO3CR/';
import {tabManager} from './UI/';

export {
    backend,
    nodeTypeManager,
    nodeTreeService,
    tabManager,
    changeManager,
    feedbackManager,
    publishingService,
    i18n
};
