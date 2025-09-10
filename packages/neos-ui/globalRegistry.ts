import {SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {GlobalRegistry} from "@neos-project/neos-ts-interfaces";

/**
 * Access to the global registry.
 *
 * FIXME
 * Note that we often pass the global registry around instead and inject it via the react context -> this should be simplified in favour of this global state.
 * Also the global registry is residing in @neos-project/neos-ui where technically no package has a dependency on (as it should) a future refactoring should tackle this as well.
 */
// FIXME SynchronousMetaRegistry vs GlobalRegistry type dilemma
export const globalRegistry = new SynchronousMetaRegistry(`The global registry`) as unknown as GlobalRegistry;
