import {service} from '../../../Shared/';
const {logger} = service;

export default (feedback, envelope) => {
    alert(feedback.payload.message);
};
