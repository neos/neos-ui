import backend from './Backend.js';
import changeManager from './ChangeManager.js';
import feedbackManager from './FeedbackManager.js';
import {nodeTypeManager, publishingService} from './TYPO3CR/';
import {tabManager} from './UI/';

export default {
    backend,
    nodeTypeManager,
    tabManager,
    changeManager,
    feedbackManager,
    publishingService
};
