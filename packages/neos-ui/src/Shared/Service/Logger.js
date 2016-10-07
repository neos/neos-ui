import _debug from 'debug';

const info = _debug('Neos.Ui:info');
const log = _debug('Neos.Ui:log');
const error = _debug('Neos.Ui:error');
const warning = _debug('Neos.Ui:warning');
const deprecate = _debug('Neos.Ui:deprecated');

export {
    info,
    log,
    error,
    warning,
    deprecate
};
