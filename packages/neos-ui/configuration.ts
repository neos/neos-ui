
// @ts-ignore
import { configuration as configurationOriginal } from './src/System';

/**
 * Access to the global configuration.
 *
 * FIXME
 * Note that we often pass the configuration around instead and inject it via the react context -> this should be simplified in favour of this global state.
 * Also the configuration is residing in @neos-project/neos-ui where technically no package has a dependency on (as it should) a future refactoring should tackle this as well.
 */
export const configuration: {
    nodeTree?: {
        loadingDepth?: number
    }
} = configurationOriginal;
