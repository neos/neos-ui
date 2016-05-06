import {isSignalDescription, process} from 'Guest/Process/SignalRegistry/index';

const processConfiguration = (configuration, oldConfiguration = null) => Object.keys(oldConfiguration || configuration).reduce(
    (processedConfiguration, key) => {
        const item = configuration && configuration[key];

        if (typeof item === 'function') {
            const result = item();

            if (typeof result !== 'function') {
                processedConfiguration[key] = result;
                return processedConfiguration;
            }

            throw new Error('Cannot add a function to the toolbar configuration');
        }

        if (isSignalDescription(item) || isSignalDescription(oldConfiguration && oldConfiguration[key])) {
            if (oldConfiguration) {
                processedConfiguration[key] = oldConfiguration[key];
                return processedConfiguration;
            }

            processedConfiguration[key] = process(item);
            return processedConfiguration;
        }

        if (typeof item === 'object') {
            processedConfiguration[key] = processConfiguration(item, oldConfiguration && oldConfiguration[key]);
            return processedConfiguration;
        }

        if (typeof item === undefined) {
            return processConfiguration;
        }

        processedConfiguration[key] = item;
        return processedConfiguration;
    },
    Array.isArray(configuration) ? [] : {}
);

export default processConfiguration;
