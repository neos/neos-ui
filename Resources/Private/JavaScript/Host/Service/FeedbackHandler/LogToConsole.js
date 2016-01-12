import {service} from 'Shared/';
const {logger} = service;

export default (feedback, envelope) => {
    switch (feedback.payload.severity) {
        case 'ERROR':
            logger.error(feedback.payload.message);
            break;

        default:
            logger.info(feedback.payload.message);
            break;
    }
};
