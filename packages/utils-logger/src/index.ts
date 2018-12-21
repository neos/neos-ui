import _debug from 'debug';

const info = _debug('Neos.Ui:info');
const log = _debug('Neos.Ui:log');
const error = _debug('Neos.Ui:error');
const warning = _debug('Neos.Ui:warning');

//
// Deprecation warnings are on a higher level and not bound to UI only,
// due to flexibility and the dependency on the Neos application itself.
//
const deprecate = _debug('Neos:deprecated');

//
// ToDo: Find a more sophisticated way to enable/disable certain messages.
//
// The `debug` package does not swallow messages which are logged before
// this enable step, but we cannot say for certain that the API has
// booted up correctly at the end of the event-loop.
//
const initialize = (systemEnv: string) => {
    //
    // Disable deprecation warnings for now while in `Development`,
    // since debugging would be a mess otherwise.
    //
    if (systemEnv === 'Development') {
        _debug.enable('Neos.Ui:*');
    } else {
        _debug.enable('Neos*');
    }
};

export default {
    info,
    log,
    error,
    warning,
    deprecate,
    initialize
};
